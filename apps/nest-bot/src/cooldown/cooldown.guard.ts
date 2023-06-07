import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { add, isPast } from 'date-fns'
import { COMMAND_GROUP_METADATA, CommandContext, CommandDiscovery, KickerExecutionContext } from 'src/kicker'
import { CooldownActivityService } from './cooldown-activity'
import { CommandGroupDiscovery } from 'src/kicker/commands/command-group.discovery'
import { CooldownService } from './cooldown.service'

@Injectable()
export class CooldownGuard implements CanActivate {
  constructor(
    private readonly cooldownService: CooldownService,
    private readonly cooldownActivityService: CooldownActivityService
  ) { }

  canActivate(context: ExecutionContext) {
    const kickerContext = KickerExecutionContext.create(context)
    const [commandCtx] = kickerContext.getContext<CommandContext>()
    const discovery = kickerContext.getDiscovery()

    if (!(discovery instanceof CommandDiscovery)) {
      return false
    }

    if (this.globalCooldownSuccess(commandCtx.sender.id)) {
      const group: CommandGroupDiscovery | undefined = Reflect.getMetadata(COMMAND_GROUP_METADATA, discovery.getClass())
      const groupName = group?.getName()
      const commandName = `${groupName ?? ''} ${discovery.getName()}`.trim()

      const commandCooldown = this.cooldownService.activeCooldowns.get(commandName)

      if (commandCooldown) {
        const commandActivity = this.cooldownActivityService.viewerActivity.get(commandCtx.sender.id)
        const commandUsage = commandActivity?.commands.find(x => x.handler === discovery)
        if (commandUsage) {
          return false
        }
      }

      return true
    }

    return false
  }

  private globalCooldownSuccess(userId: number) {
    if (!this.cooldownService.globalEnabled) {
      return true
    }

    const viewerActivity = this.cooldownActivityService.viewerActivity.get(userId)
    if (!viewerActivity?.lastCommandUsedAt) { // Hasn't used a command recently
      return true
    }

    if (isPast(add(viewerActivity.lastCommandUsedAt, { seconds: this.cooldownService.globalCooldown }))) {
      return true
    }

    return false
  }
}
