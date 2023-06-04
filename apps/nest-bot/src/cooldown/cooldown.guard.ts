import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { add, isPast } from 'date-fns'
import { CommandContext, CommandDiscovery, KickerExecutionContext } from 'src/kicker'
import { ViewerActivityService } from 'src/viewers/viewer-activity.service'

@Injectable()
export class CooldownGuard implements CanActivate {
  private readonly globalCooldown = 5

  constructor(
    private readonly viewerActivityService: ViewerActivityService
  ) { }

  canActivate(context: ExecutionContext) {
    const kickerContext = KickerExecutionContext.create(context)
    const [commandCtx] = kickerContext.getContext<CommandContext>()
    const discovery = kickerContext.getDiscovery()

    if (!(discovery instanceof CommandDiscovery)) {
      return false
    }

    const viewerActivity = this.viewerActivityService.viewerActivity.get(commandCtx.sender.id)
    if (!viewerActivity) { // No recent chat history
      return true
    }

    if (!viewerActivity.lastCommandUsedAt) { // Hasn't used a command recently
      return true
    }

    if (isPast(add(viewerActivity.lastCommandUsedAt, { seconds: this.globalCooldown }))) {
      return true
    }

    return false
  }
}
