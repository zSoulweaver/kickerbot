import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { PermissionLevel } from '@prisma/client'

@Injectable()
export class PermissionsService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async setInitalCommandLevel(commandName: string, level: PermissionLevel) {
    await this.prisma.commandPermission.upsert({
      where: { command: commandName },
      create: {
        command: commandName,
        permission: level
      },
      update: {}
    })
  }

  async setCommandLevel(commandName: string, level: PermissionLevel) {
    const commandPermission = await this.prisma.commandPermission.upsert({
      where: { command: commandName },
      create: {
        command: commandName,
        permission: level
      },
      update: {
        permission: level
      }
    })

    return commandPermission
  }

  async getPermissionLevel(commandName: string) {
    const commandPermission = await this.prisma.commandPermission.findFirst({ where: { command: commandName } })
    return commandPermission
  }
}
