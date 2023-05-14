import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { Context, ContextOf, On } from 'src/kicker'
import { isFuture, add } from 'date-fns'

interface ActiveViewerInfo {
  username: string
  lastActive: Date
}
type ActiveViewersMap = Map<number, ActiveViewerInfo>

@Injectable()
export class ViewerActivityService {
  public readonly activeViewers: ActiveViewersMap = new Map()

  @On('onMessage')
  onMessage(@Context() [ctx]: ContextOf<'onMessage'>) {
    this.activeViewers.set(ctx.sender.id, {
      username: ctx.sender.username,
      lastActive: new Date()
    })
  }

  @Cron('*/10 * * * * *')
  checkActive() {
    for (const viewer of this.activeViewers) {
      if (!isFuture(add(viewer[1].lastActive, { seconds: 30 }))) {
        this.activeViewers.delete(viewer[0])
      }
    }
  }
}
