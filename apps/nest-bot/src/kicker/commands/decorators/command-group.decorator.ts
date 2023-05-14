import { SetMetadata } from '@nestjs/common'
import { CommandGroupDiscovery, CommandGroupMeta } from '../command-group.discovery'
import { COMMAND_GROUP_METADATA } from 'src/kicker/kicker.constants'

export const CommandGroup = (options: CommandGroupMeta): ClassDecorator =>
  SetMetadata(
    COMMAND_GROUP_METADATA,
    new CommandGroupDiscovery(options)
  )
