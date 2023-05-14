import { Module } from '@nestjs/common'
import { TimersService } from './timers.service'
import { TimersCommands } from './timers.commands'

@Module({
  providers: [
    TimersService,
    TimersCommands
  ]
})
export class TimersModule { }
