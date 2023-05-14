import { Injectable } from '@nestjs/common'
import { Arguments, ArgumentsPipe, Command, CommandContext, CommandGroup, CommandsService, Context } from 'src/kicker'
import { TimersService } from './timers.service'
import { TimersSetInput } from './dto/timers-set.input'
import { ChatMessageEvent } from '@kickerbot/kclient'
import { TimersRemoveInput } from './dto/timers-remove.input'

@Injectable()
@CommandGroup({ name: 'timers' })
export class TimersCommands {
  constructor(
    private readonly timersService: TimersService,
    private readonly commandsService: CommandsService
  ) { }

  @Command({ name: 'set' })
  public addTimerCommand(
    @Arguments(ArgumentsPipe) args: TimersSetInput,
    @Context() [ctx]: CommandContext
  ) {
    const handler = this.commandsService.getCommandHandler(args.command)
    if (!handler) {
      return 'Specified command doesn\'t exist'
    }
    const newCtx: Omit<ChatMessageEvent, 'getMetadata'> = {
      ...ctx,
      content: args.command.join(' ')
    }
    this.timersService.setupTimer(ctx.chatroom_id, { commandHandler: handler.handle, context: newCtx }, args.interval)
    return `Timer set up for "${args.command.join(' ')}" to run every ${args.interval} milliseconds`
  }

  @Command({ name: 'remove' })
  public removeTimerCommand(@Arguments(ArgumentsPipe) args: TimersRemoveInput) {
    const handler = this.commandsService.getCommandHandler(args.command)
    if (!handler) {
      return 'Specified command doesn\'t exist'
    }
    this.timersService.removeTimer(handler.handle)
    return `Timer for command "${args.command.join(' ')}" has been removed`
  }
}