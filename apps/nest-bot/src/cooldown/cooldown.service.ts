import { Injectable } from '@nestjs/common'
import { CommandCooldown } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { SettingsService } from 'src/settings/settings.service'
import { CooldownSettings } from './cooldown.settings'

@Injectable()
export class CooldownService {
  public readonly activeCooldowns = new Map<string, CommandCooldown>()
  public globalEnabled = true
  public globalCooldown = 5

  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService<CooldownSettings>
  ) { }

  async setCooldown(commandName: string, cooldown: number) {
    const commandCooldown = await this.prisma.commandCooldown.upsert({
      where: { command: commandName },
      create: {
        command: commandName,
        cooldown,
        enabled: true
      },
      update: {
        cooldown
      }
    })

    return commandCooldown
  }

  async removeCooldown(commandName: string) {
    await this.prisma.commandCooldown.delete({
      where: { command: commandName }
    })
  }

  async setCooldownEnabled(commandName: string, enabled: boolean) {
    const commandCooldown = await this.prisma.commandCooldown.update({
      where: { command: commandName },
      data: {
        enabled
      }
    })

    return commandCooldown
  }

  async getCooldown(commandName: string) {
    const commandCooldown = await this.prisma.commandCooldown.findFirst({
      where: { command: commandName }
    })

    return commandCooldown
  }

  async getAllEnabledCooldowns() {
    const cooldowns = await this.prisma.commandCooldown.findMany({
      where: { enabled: true }
    })
    return cooldowns
  }

  async setGlobalCooldownEnabled(value: boolean) {
    this.globalEnabled = value
    await this.settingsService.set('cooldownGlobalEnabled', value)
  }

  async setGlobalCooldown(seconds: number) {
    this.globalCooldown = seconds
    await this.settingsService.set('cooldownGlobal', seconds)
  }
}
