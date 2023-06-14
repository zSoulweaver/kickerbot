import { Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common'
import { CommandDiscovery } from './command.discovery'
import { ExplorerService } from '../kicker-explorer.service'
import { COMMAND_GROUP_METADATA, COMMAND_METADATA } from '../kicker.constants'
import { CommandGroupDiscovery } from './command-group.discovery'
import { Reflector } from '@nestjs/core'
import { DiscoveredClassWithMeta } from '@golevelup/nestjs-discovery'
import { ValidationError } from '@deepkit/type'
import { ChatMessageEvent, KickClient, MessagesMessageMetadata } from '@kickerbot/kclient'
import { KickerException } from '../kicker.exception'
import { ListenersService } from '../listeners'

type CommandGroupMap = Map<string, CommandDiscovery | CommandGroupMap>
type CommandMap = Map<string, CommandDiscovery | CommandGroupMap>
interface CommandHandler {
  handle: CommandDiscovery
  groupName?: string
  fullCommandName: string
}

@Injectable()
export class CommandsService implements OnModuleInit, OnApplicationBootstrap {
  private readonly logger = new Logger(CommandsService.name)
  private readonly commands: CommandMap = new Map()
  private readonly commandGroups: Array<{ name: string, description?: string }> = []

  public constructor(
    private readonly client: KickClient,
    private readonly explorerService: ExplorerService,
    private readonly reflector: Reflector,
    private readonly listenersService: ListenersService
  ) { }

  public async onModuleInit() {
    const commandGroups = await this.explorerService.exploreProviders<CommandGroupDiscovery>(COMMAND_GROUP_METADATA)
    for (const commandGroup of commandGroups) {
      await this.addCommandGroup(commandGroup)
      this.commandGroups.push({
        name: commandGroup.meta.getName(),
        description: commandGroup.meta.getDescription()
      })
    }

    const commands = await this.explorerService.explore<CommandDiscovery>(COMMAND_METADATA)
    for (const command of commands) {
      this.add(command)
    }
  }

  public onApplicationBootstrap() {
    this.client.on('onMessage', messageData => {
      if (this.client.currentUserDetails?.username === messageData.sender.username) {
        return
      }
      this.logger.log(`Received Message, [${messageData.sender.username}]: ${messageData.content}`)

      const handler = this.resolveCommand(messageData.content)
      if (!handler) return

      void this.handleCommand(messageData.chatroom_id, handler.handle, messageData, messageData.getMetadata())
    })
  }

  public async handleCommand(chatroomId: number, handler: CommandDiscovery, context: ChatMessageEvent, messageMetadata?: MessagesMessageMetadata) {
    try {
      const commandOutput = await handler.execute([context]) as string
      this.logger.log(`[Bot Response]: ${commandOutput}`)
      await this.client.api.messages.send(chatroomId.toString(), commandOutput, messageMetadata)
      void this.listenersService.commandExecuted(handler, context)
    } catch (err) {
      if (err instanceof ValidationError) {
        const botResponse = 'Failed to due to invalid arguments.'
        // This doesn't work if the error type is a union :(
        // for (const error of err.errors) {
        //   if (error.code !== 'type') {
        //     return
        //   }
        //   const splitMessage = error.message.split(' ')
        //   const type = splitMessage[splitMessage.length - 1]
        //   botResponse = `${botResponse} "${error.path}" should be a ${type}`
        // }
        this.logger.log(`[Bot Response]: ${botResponse}`)
        await this.client.api.messages.send(chatroomId.toString(), botResponse, messageMetadata)
        return err
      }
      if (err instanceof KickerException) {
        if (err.outputToChat) {
          await this.client.api.messages.send(chatroomId.toString(), err.message, messageMetadata)
          return err
        }
      }
      this.logger.error(err)
      return err
    }
  }

  public resolveCommand(chatMessage: string): CommandHandler | null {
    const content = chatMessage.toLowerCase()
    const prefix = '!'

    if (!content.startsWith(prefix)) return null

    const args = content.substring(prefix.length).split(/ +/g)
    return this.getCommandHandler(args)
  }

  public getCommandHandler(args: string[]): CommandHandler | null {
    let currentMap: Map<any, any> = this.commands
    let handler: CommandDiscovery | null = null

    for (const arg of args) {
      currentMap = currentMap.get(arg)

      if (!currentMap) {
        break
      }

      if (currentMap instanceof CommandDiscovery) {
        handler = currentMap
        break
      }

      if (currentMap.has('')) {
        handler = currentMap.get('')
      }
    }

    if (handler instanceof CommandDiscovery) {
      const group: CommandGroupDiscovery | undefined = Reflect.getMetadata(COMMAND_GROUP_METADATA, handler.getClass())
      const groupName = group?.getName()
      return {
        handle: handler,
        groupName,
        fullCommandName: `${groupName ?? ''} ${handler.getName()}`.trim()
      }
    } else {
      return null
    }
  }

  public async addCommandGroup(commandGroup: DiscoveredClassWithMeta<CommandGroupDiscovery>) {
    const meta = commandGroup.meta
    const groupName = meta.getName()
    const groupClassName = meta.getClassName() ?? 'Unknown Class'

    if (this.commands.has(groupName)) {
      this.logger.warn(`CommandGroup "${groupName}" already exists, skipping. Duplicate found on class: ${groupClassName}`)
      return
    }

    const groupCommands = await this.explorerService.exploreMethodsOnProvider<CommandDiscovery>(commandGroup, COMMAND_METADATA)

    const groupMapReturn = this.createCommandMap(groupCommands)
    this.commands.set(groupName, groupMapReturn)
    this.logger.log(`Registered command group "${groupName}"`)
  }

  private createCommandMap(commands: CommandDiscovery[]) {
    const commandMap = new Map()

    commands.forEach((command) => {
      const subCommands = command.getName().split(' ')
      let currentMap = commandMap

      subCommands.forEach((subcommand, index) => {
        if (subcommand === '') {
          // If commandName is '', set handler for the root command
          currentMap.set('', command)
        } else {
          if (!currentMap.has(subcommand)) {
            // If subcommand doesn't exist, create a new Map
            currentMap.set(subcommand, new Map())
          }
          if (index === subCommands.length - 1) {
            // If at the end of subcommands, set the handler
            currentMap.get(subcommand)?.set('', command)
          }
          // Move to the next level of the Map
          currentMap = currentMap.get(subcommand)
        }
      })
    })

    return commandMap as CommandGroupMap
  }

  public add(command: CommandDiscovery) {
    const commandGroup = this.reflector.get<CommandGroupDiscovery>(COMMAND_GROUP_METADATA, command.getClass())
    if (commandGroup) {
      return
    }
    const name = command.getName()

    const existing = this.commands.get(name)
    if (existing) {
      if (existing instanceof Map) {
        this.logger.warn(`Command "${name}" already exists as a command group`)
      } else {
        this.logger.warn(`Command "${name}" already exists`)
      }
      return
    }

    this.commands.set(name, command)
    this.logger.log(`Registered command "${name}"`)
  }

  public remove(name: string) {
    this.commands.delete(name.toLowerCase())
  }

  public addManual(rootName: string, mapValue: CommandDiscovery | CommandGroupMap) {
    this.commands.set(rootName.toLowerCase(), mapValue)
  }

  public getElement(name: string) {
    return this.commands.get(name.toLowerCase())
  }

  public convertMapToObject(map, rootGroup = '') {
    const result: any[] = []

    if (rootGroup) {
      const value = map.get(rootGroup)
      if (value instanceof CommandDiscovery) {
        result.push({
          command: rootGroup,
          description: value.getDescription()
        })
      } else {
        const commands = this.traverseMap(value, rootGroup)
        const groupInfo = this.commandGroups.find(x => x.name === rootGroup)
        result.push({
          commandGroup: rootGroup,
          description: groupInfo?.description,
          commands
        })
      }
    } else {
      for (const [key, value] of map) {
        if (value instanceof CommandDiscovery) {
          result.push({
            command: key,
            description: value.getDescription()
          })
        } else {
          const commands = this.traverseMap(value, key)
          const groupInfo = this.commandGroups.find(x => x.name === key)
          result.push({
            commandGroup: key,
            description: groupInfo?.description,
            commands
          })
        }
      }
    }

    return result
  }

  private traverseMap(map: CommandGroupMap, prefix: string) {
    let commands: any[] = []

    for (const [key, value] of map) {
      if (value instanceof CommandDiscovery) {
        commands.push({
          command: `${prefix} ${key}`.trim(),
          description: value.getDescription()
        })
      } else {
        commands = commands.concat(this.traverseMap(value, `${prefix} ${key}`.trim()))
      }
    }

    return commands
  }

  get commandList() {
    return this.commands
  }

  get commandListJSON() {
    return this.convertMapToObject(this.commands)
  }
}
