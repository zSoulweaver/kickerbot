import { Global, Logger, Module, OnModuleInit } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { PermissionCommands } from './permission.commands'
import { PrismaService } from 'src/prisma.service'
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery'
import { DEFAULT_ROLE_METADATA } from './default-role.decorator'
import { Reflector } from '@nestjs/core'
import { COMMAND_GROUP_METADATA, COMMAND_METADATA, CommandDiscovery } from 'src/kicker'
import { CommandGroupDiscovery } from 'src/kicker/commands/command-group.discovery'
import { PermissionLevel } from '@prisma/client'

@Global()
@Module({
  imports: [
    DiscoveryModule
  ],
  providers: [
    PrismaService,
    PermissionsService,
    PermissionCommands
  ],
  exports: [PermissionsService]
})
export class PermissionsModule implements OnModuleInit {
  private readonly logger = new Logger(PermissionsModule.name)

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionsService
  ) { }

  async onModuleInit() {
    const methods = await this.discovery.providerMethodsWithMetaAtKey<PermissionLevel>(DEFAULT_ROLE_METADATA)
    for (const method of methods) {
      const command = this.reflector.get<CommandDiscovery>(COMMAND_METADATA, method.discoveredMethod.handler)
      const commandGroup = this.reflector.get<CommandGroupDiscovery>(COMMAND_GROUP_METADATA, method.discoveredMethod.parentClass.instance.constructor)

      const commandGroupName = commandGroup ? commandGroup.getName() : ''
      const fullCommandName = `${commandGroupName} ${command.getName()}`.trim()

      const permission = method.meta
      await this.permissionService.setInitalCommandLevel(fullCommandName, permission)
    }
    this.logger.log('Set initial command permissions')
  }
}
