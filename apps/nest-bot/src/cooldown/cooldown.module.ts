import { Global, Module, OnModuleInit } from '@nestjs/common'
import { CooldownService } from './cooldown.service'
import { CooldownCommands } from './cooldown.commands'
import { PrismaService } from 'src/prisma.service'
import { CooldownActivityService } from './cooldown-activity'
import { SettingsModule } from 'src/settings/settings.module'
import { SettingsService } from 'src/settings/settings.service'
import { CooldownSettings } from './cooldown.settings'

@Global()
@Module({
  imports: [
    SettingsModule.register(CooldownModule.name)
  ],
  providers: [
    PrismaService,
    CooldownService,
    CooldownCommands,
    CooldownActivityService
  ],
  exports: [
    CooldownService,
    CooldownActivityService
  ]
})
export class CooldownModule implements OnModuleInit {
  constructor(
    private readonly cooldownService: CooldownService,
    private readonly settingsService: SettingsService<CooldownSettings>
  ) { }

  async onModuleInit() {
    const cooldowns = await this.cooldownService.getAllEnabledCooldowns()
    for (const cooldown of cooldowns) {
      this.cooldownService.activeCooldowns.set(cooldown.command, cooldown)
    }

    const cooldownEnabled = (await this.settingsService.getSetting('cooldownGlobalEnabled')) === 'true'
    await this.cooldownService.setGlobalCooldownEnabled(cooldownEnabled)

    const globalCooldown = await this.settingsService.getSetting('cooldownGlobal')
    await this.cooldownService.setGlobalCooldown(parseInt(globalCooldown ?? '5'))
  }
}
