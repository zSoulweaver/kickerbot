import { ChatMessageEvent, MessagesMessageMetadata } from '@kickerbot/kclient'
import { Injectable } from '@nestjs/common'
import { CommandDiscovery, CommandsService } from 'src/kicker'

@Injectable()
export class TimersService {
  private readonly timersMap = new Map<CommandDiscovery, NodeJS.Timer>()

  constructor(
    private readonly commandsService: CommandsService
  ) { }

  setupTimer(
    chatroomId: number,
    handler: {
      commandHandler: CommandDiscovery
      context: ChatMessageEvent
    },
    interval: number,
    messageMetadata?: MessagesMessageMetadata
  ) {
    const intervalHandle = setInterval(() => {
      void this.commandsService.handleCommand(chatroomId, handler.commandHandler, handler.context, messageMetadata)
    }, interval)

    this.timersMap.set(handler.commandHandler, intervalHandle)
  }

  removeTimer(commandHandler: CommandDiscovery) {
    const intervalHandle = this.timersMap.get(commandHandler)
    clearInterval(intervalHandle)
  }
}
