import { Module, OnApplicationBootstrap } from '@nestjs/common'
import { AliasService } from './alias.service'
import { AliasCommands } from './alias.commands'
import { PrismaService } from 'src/prisma.service'
import { CommandsService } from 'src/kicker'

@Module({
  providers: [
    AliasService,
    AliasCommands,
    PrismaService
  ],
  exports: [
    AliasService
  ]
})
export class AliasModule implements OnApplicationBootstrap {
  constructor(
    private readonly aliasService: AliasService,
    private readonly commandService: CommandsService
  ) {}

  async onApplicationBootstrap() {
    const aliases = await this.aliasService.getAliases()
    for (const aliasItem of aliases) {
      const existingMapRoot = this.commandService.getElement(aliasItem.target)
      if (existingMapRoot) {
        this.commandService.addManual(aliasItem.alias, existingMapRoot)
      } else {
        await this.aliasService.removeAlias(aliasItem.alias)
      }
    }
  }
}
