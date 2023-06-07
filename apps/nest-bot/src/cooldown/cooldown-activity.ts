import { Injectable } from '@nestjs/common'
import { COMMAND_GROUP_METADATA, CommandDiscovery, Context, ContextOf, On } from 'src/kicker'
import { CooldownService } from './cooldown.service'
import { CommandGroupDiscovery } from 'src/kicker/commands/command-group.discovery'

interface ViewerActivity {
  lastCommandUsedAt?: Date
  commands: Array<{
    handler: CommandDiscovery
    lastUsedAt: Date
  }>
}
type ViewerActivityMap = Map<number, ViewerActivity>

@Injectable()
export class CooldownActivityService {
  public readonly viewerActivity: ViewerActivityMap = new Map()

  constructor(
    private readonly cooldownService: CooldownService
  ) { }

  @On('onCommandExecuted')
  onCommand(@Context() [handler, ctx]: ContextOf<'onCommandExecuted'>) {
    const activityDate = new Date()
    const activeViewerInfo = this.viewerActivity.get(ctx.sender.id) ?? {
      lastCommandUsedAt: activityDate,
      commands: []
    }

    activeViewerInfo.lastCommandUsedAt = activityDate
    activeViewerInfo.commands.push({
      handler,
      lastUsedAt: activityDate
    })

    this.viewerActivity.set(ctx.sender.id, activeViewerInfo)

    const group: CommandGroupDiscovery | undefined = Reflect.getMetadata(COMMAND_GROUP_METADATA, handler.getClass())
    const groupName = group?.getName()
    const commandName = `${groupName ?? ''} ${handler.getName()}`.trim()

    const commandCooldown = this.cooldownService.activeCooldowns.get(commandName)
    if (commandCooldown) {
      setTimeout(() => {
        const viewerActivity = this.viewerActivity.get(ctx.sender.id)
        if (viewerActivity) {
          const commands = viewerActivity.commands.filter(x => x.lastUsedAt !== activityDate)
          this.viewerActivity.set(ctx.sender.id, {
            ...viewerActivity,
            commands
          })
        }
      }, commandCooldown.cooldown * 1000)
    }
  }
}
