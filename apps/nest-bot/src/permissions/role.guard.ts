import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { COMMAND_GROUP_METADATA, CommandContext, CommandDiscovery, KickerExecutionContext } from 'src/kicker'
import { PermissionsService } from './permissions.service'
import { CommandGroupDiscovery } from 'src/kicker/commands/command-group.discovery'
import { ViewersService } from 'src/viewers/viewers.service'
import { PermissionLevel } from '@prisma/client'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly viewersService: ViewersService
  ) { }

  async canActivate(context: ExecutionContext) {
    const kickerContext = KickerExecutionContext.create(context)
    const [commandCtx] = kickerContext.getContext<CommandContext>()
    const discovery = kickerContext.getDiscovery()

    if (!(discovery instanceof CommandDiscovery)) {
      return false
    }

    const permissionLevelValues = Object.values(PermissionLevel)

    const group: CommandGroupDiscovery | undefined = Reflect.getMetadata(COMMAND_GROUP_METADATA, discovery.getClass())
    const groupName = group?.getName()
    const commandName = `${groupName ?? ''} ${discovery.getName()}`.trim()
    const commandPermissions = await this.permissionsService.getPermissionLevel(commandName)

    if (commandPermissions === null) {
      return true // Assume level is viewer
    }

    const senderId = commandCtx.sender.id
    const senderPermission = await this.viewersService.get({ id: senderId })

    if (senderPermission === null && commandPermissions.permission === PermissionLevel.VIEWER) {
      return true
    }

    const commandPermissionLevel = permissionLevelValues.indexOf(commandPermissions.permission)
    const senderPermissionLevel = permissionLevelValues.indexOf(senderPermission?.permission ?? 'VIEWER')

    if (senderPermissionLevel >= commandPermissionLevel) {
      return true
    }

    return false
  }
}
