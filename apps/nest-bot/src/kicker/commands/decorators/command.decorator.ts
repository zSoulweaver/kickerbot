import { SetMetadata } from '@nestjs/common'
import { CommandDiscovery, CommandMeta } from '../command.discovery'
import { COMMAND_METADATA } from 'src/kicker/kicker.constants'

export const Command = (options: CommandMeta): MethodDecorator => SetMetadata<string, CommandDiscovery>(COMMAND_METADATA, new CommandDiscovery(options))
