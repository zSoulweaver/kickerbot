import { Injectable } from '@nestjs/common'
import { Arguments, Command, CommandGroup, CommandsService } from 'src/kicker'
import { PermissionsService } from './permissions.service'
import { PermissionLevel } from '@prisma/client'
import { PermissionsSetInput } from './dto/permissions-set.input'
import { PermissionsGetInput } from './dto/permissions-get.input'

@Injectable()
@CommandGroup({ name: 'permissions' })
export class PermissionCommands {
  constructor(
    private readonly commandsService: CommandsService,
    private readonly permissionsService: PermissionsService
  ) { }

  @Command({ name: 'set' })
  async setCommandPermission(@Arguments args: PermissionsSetInput) {
    const handler = this.commandsService.getCommandHandler(args.command)
    if (!handler) {
      return `Unknown command "!${args.command.join(' ')}" to set permissions on.`
    }

    console.log(handler.fullCommandName)

    const permissionLevel: PermissionLevel = PermissionLevel[args.permissionLevel.toUpperCase()]
    if (!permissionLevel) {
      return 'Invalid permission level'
    }

    try {
      await this.permissionsService.setCommandLevel(handler.fullCommandName, permissionLevel)
      return `Permission level for "${handler.fullCommandName}" has been set for ${permissionLevel.toLowerCase()} or higher.`
    } catch (err) {
      console.log(err)
    }
  }

  @Command({ name: 'get' })
  async getCommandPermission(@Arguments args: PermissionsGetInput) {
    const handler = this.commandsService.getCommandHandler(args.command)
    if (!handler) {
      return `Unknown command "!${args.command.join(' ')}" to get permissions for.`
    }

    const permission = await this.permissionsService.getPermissionLevel(handler.fullCommandName)
    if (!permission) {
      return `Permission level for "${handler.fullCommandName}" is ${PermissionLevel.VIEWER.toLowerCase()} or higher.`
    }
    return `Permission level for "${handler.fullCommandName}" is ${permission.permission.toLowerCase()} or higher.`
  }
}
