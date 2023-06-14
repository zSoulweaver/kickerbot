import { Injectable } from '@nestjs/common'
import { Arguments, Command, CommandGroup, CommandsService } from 'src/kicker'
import { CooldownService } from './cooldown.service'
import { CooldownSetInput } from './command-dto/cooldown-set.input'
import { CooldownEnableDisableInput } from './command-dto/cooldown-enable-disable.input'
import { CooldownRemoveInput } from './command-dto/cooldown-remove.input'
import { CooldownGlobalInput } from './command-dto/cooldown-global.input'
import { CooldownGlobalSet } from './command-dto/cooldown-global-set.input'

@Injectable()
@CommandGroup({
  name: 'cooldown',
  description: 'Handles command cooldowns'
})
export class CooldownCommands {
  constructor(
    private readonly cooldownService: CooldownService,
    private readonly commandsService: CommandsService
  ) {}

  @Command({
    name: 'set',
    description: 'Sets x second cooldown on a specified command'
  })
  async setCooldown(@Arguments args: CooldownSetInput) {
    const handler = this.commandsService.getCommandHandler(args.command.split(' '))
    if (!handler) {
      return `Unknown command "!${args.command}" to set cooldowns on.`
    }

    await this.cooldownService.setCooldown(handler.fullCommandName, args.seconds)
    return `Cooldown for "${handler.fullCommandName}" has been set for ${args.seconds} seconds.`
  }

  @Command({
    name: 'remove',
    description: 'Removes set cooldown on a specified command'
  })
  async removeCooldown(@Arguments args: CooldownRemoveInput) {
    const handler = this.commandsService.getCommandHandler(args.command.split(' '))
    if (!handler) {
      return `Unknown command "!${args.command}" to remove cooldowns on.`
    }

    await this.cooldownService.removeCooldown(handler.fullCommandName)
    return `Cooldown for "${handler.fullCommandName}" has been removed.`
  }

  @Command({
    name: 'enable',
    description: 'Enables set cooldown on a specified command'
  })
  async enableCooldown(@Arguments args: CooldownEnableDisableInput) {
    const handler = this.commandsService.getCommandHandler(args.command.split(' '))
    if (!handler) {
      return `Unknown command "!${args.command}" to enable cooldowns on.`
    }

    await this.cooldownService.setCooldownEnabled(handler.fullCommandName, true)
    return `Cooldown for "${handler.fullCommandName}" has been enabled.`
  }

  @Command({
    name: 'disable',
    description: 'Disabled set cooldown on a specified command'
  })
  async disableCooldown(@Arguments args: CooldownEnableDisableInput) {
    const handler = this.commandsService.getCommandHandler(args.command.split(' '))
    if (!handler) {
      return `Unknown command "!${args.command}" to disable cooldowns on.`
    }

    await this.cooldownService.setCooldownEnabled(handler.fullCommandName, false)
    return `Cooldown for "${handler.fullCommandName}" has been enabled.`
  }

  @Command({
    name: 'global enabled',
    description: 'Allows the global cooldown to be set on or off'
  })
  async setGlobalCooldownEnabled(@Arguments args: CooldownGlobalInput) {
    await this.cooldownService.setGlobalCooldownEnabled(args.value)
    return `Global cooldown has been ${args.value ? 'enabled' : 'disabled'}.`
  }

  @Command({
    name: 'global set',
    description: 'Set the global cooldown for x seconds'
  })
  async setGlobalCooldown(@Arguments args: CooldownGlobalSet) {
    await this.cooldownService.setGlobalCooldown(args.seconds)
    return `Global cooldown has been set for ${args.seconds} seconds.`
  }

  @Command({
    name: 'global',
    description: 'Retrieve current information about the global cooldown settings'
  })
  async getGlobalInformation() {
    const enabled = this.cooldownService.globalEnabled
    const seconds = this.cooldownService.globalCooldown
    return `Global cooldown is currently ${enabled ? 'enabled' : 'disabled'}. Cooldown is set for ${seconds} seconds.`
  }
}
