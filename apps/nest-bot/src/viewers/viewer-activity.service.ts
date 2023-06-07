import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { Context, ContextOf, On } from 'src/kicker'
import { isFuture, add } from 'date-fns'

interface ViewerActivityInfo {
  username: string
  lastActiveAt: Date
}
type ViewerActivityMap = Map<number, ViewerActivityInfo>

@Injectable()
export class ViewerActivityService {
  public readonly viewerActivity: ViewerActivityMap = new Map()

  @On('onMessage')
  onMessage(@Context() [ctx]: ContextOf<'onMessage'>) {
    const activeViewerInfo = this.viewerActivity.get(ctx.sender.id) ?? {
      username: ctx.sender.username,
      lastActiveAt: new Date()
    }

    activeViewerInfo.lastActiveAt = new Date()

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
