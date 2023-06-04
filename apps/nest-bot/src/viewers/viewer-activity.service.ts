import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { CommandDiscovery, Context, ContextOf, On } from 'src/kicker'
import { isFuture, add } from 'date-fns'

interface ViewerActivityInfo {
  username: string
  lastActiveAt: Date
  lastCommandUsedAt?: Date
  commands: Array<{
    handler: CommandDiscovery
    lastUsedAt: Date
  }>
}
type ViewerActivityMap = Map<number, ViewerActivityInfo>

@Injectable()
export class ViewerActivityService {
  public readonly viewerActivity: ViewerActivityMap = new Map()

  @On('onMessage')
  onMessage(@Context() [ctx]: ContextOf<'onMessage'>) {
    const activeViewerInfo = this.viewerActivity.get(ctx.sender.id) ?? {
      username: ctx.sender.username,
      lastActiveAt: new Date(),
      commands: []
    }

    activeViewerInfo.lastActiveAt = new Date()

    this.viewerActivity.set(ctx.sender.id, activeViewerInfo)
  }

  @On('onCommandExecuted')
  onCommand(@Context() [handler, ctx]: ContextOf<'onCommandExecuted'>) {
    const activeViewerInfo = this.viewerActivity.get(ctx.sender.id) ?? {
      username: ctx.sender.username,
      lastActiveAt: new Date(),
      lastCommandUsedAt: new Date(),
      commands: []
    }

    activeViewerInfo.lastCommandUsedAt = new Date()
    activeViewerInfo.commands.push({
      handler,
      lastUsedAt: new Date()
    })

    this.viewerActivity.set(ctx.sender.id, activeViewerInfo)
  }

  @Cron('*/10 * * * * *')
  checkActive() {
    for (const viewer of this.viewerActivity) {
      if (!isFuture(add(viewer[1].lastActiveAt, { seconds: 30 }))) {
        this.viewerActivity.delete(viewer[0])
      }
    }
  }
}
