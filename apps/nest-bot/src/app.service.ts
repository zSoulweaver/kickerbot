import { Injectable } from '@nestjs/common'
import { Command, CommandContext, Context, LooseArguments } from './kicker'

@Injectable()
export class AppService {
  @Command({ name: 'ping' })
  public onPing(@Context() [messageData]: CommandContext, @LooseArguments() args: string[]) {
    return 'Pong'
  }
}
