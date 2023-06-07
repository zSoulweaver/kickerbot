import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { COMMAND_GROUP_METADATA, CommandContext, CommandDiscovery, KickerExecutionContext } from 'src/kicker'
import { CooldownService } from './cooldown.service'
import { CommandGroupDiscovery } from 'src/kicker/commands/command-group.discovery'
import { CooldownActivityService } from './cooldown-activity'

@Injectable()
export class CooldownCommandGuard implements CanActivate {
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
}
