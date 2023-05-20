import { Injectable } from '@nestjs/common'
import { CommandsService, KickerException } from 'src/kicker'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class AliasService {
  constructor(
    private readonly commandService: CommandsService,
    private readonly prisma: PrismaService
  ) {}

  async addAlias(targetCommand: string, alias: string) {
    const existingMapRoot = this.commandService.getElement(targetCommand)
    if (!existingMapRoot) {
      throw new KickerException('Target command or command group doesn\'t exist in command registry', true)
    }

    const existingAlias = await this.prisma.commandAliases.findUnique({
      where: { alias }
    })
    if (existingAlias) {
      throw new KickerException('Alias already exists', true)
    }

    await this.prisma.commandAliases.create({
      data: {
        target: targetCommand,
        alias
      }
    })
    this.commandService.addManual(alias, existingMapRoot)
  }

  async removeAlias(alias: string) {
    const existingAlias = await this.prisma.commandAliases.findUnique({
      where: { alias }
    })
    if (!existingAlias) {
      throw new KickerException('No alias exists with this name', true)
    }

    await this.prisma.commandAliases.delete({
      where: { alias }
    })
    this.commandService.remove(alias)
  }

  async getAliases() {
    const aliases = await this.prisma.commandAliases.findMany()
    return aliases
  }
}
