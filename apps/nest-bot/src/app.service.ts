import { Injectable } from '@nestjs/common'
import { Command, CommandContext, CommandsService, Context, LooseArguments } from './kicker'

@Injectable()
export class AppService {
  constructor(
    private readonly commandsService: CommandsService
  ) { }

  @Command({ name: 'ping' })
  public onPing(@Context() [messageData]: CommandContext, @LooseArguments() args: string[]) {
    return 'Pong'
  }

  public getCommandList(group?: string) {
    if (!group) {
      const commands = this.commandsService.commandListJSON
      return commands
    }

    const commandList = this.commandsService.commandList
    const commands = this.commandsService.convertMapToObject(commandList, group)
    return commands
  }
}
