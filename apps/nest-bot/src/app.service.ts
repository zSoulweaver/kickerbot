import { Injectable } from '@nestjs/common'
import { Arguments, Command, CommandContext, Context } from './kicker'

@Injectable()
export class AppService {
  @Command({ name: 'ping' })
  public onPing(@Context() [messageData]: CommandContext, @Arguments() args: string[]) {
    return 'Pong'
  }
}
