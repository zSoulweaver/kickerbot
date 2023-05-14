import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { PrismaService } from 'src/prisma.service'
import { SettingsService } from 'src/settings/settings.service'
import { ViewerActivityService } from 'src/viewers/viewer-activity.service'

@Injectable()
export class PointsService {
  private readonly logger = new Logger(PointsService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly viewerActivityService: ViewerActivityService,
    private readonly settingsService: SettingsService
  ) { }

  async setPoints(username: string, points: number) {
    await this.prisma.viewer.upsert({
      where: {
        id: 2808896
      },
      update: {
        points
      },
      create: {
        id: 2808896,
        username,
        points
      }
    })
  }

  async getPoints(username: string) {
    const points = await this.prisma.viewer.findFirst({
      where: {
        username
      },
      select: { points: true }
    })
    return points?.points
  }

  @Cron('*/30 * * * * *')
  async routineAddPoints() {
    const activeViewers = this.viewerActivityService.activeViewers
    if (activeViewers.size <= 0) {
      return
    }

    const pointIncrementValue = await this.settingsService.getSetting('pointGain')

    const pointTransactions: any[] = []
    for (const viewer of activeViewers) {
      pointTransactions.push(this.prisma.viewer.upsert({
        where: {
          id: viewer[0]
        },
        update: {
          points: { increment: 5 }
        },
        create: {
          id: viewer[0],
          username: viewer[1].username,
          points: parseInt(pointIncrementValue ?? '0') ?? 0
        }
      }))
    }

    try {
      await this.prisma.$transaction(pointTransactions)
      this.logger.log(`Updated points for ${pointTransactions.length} viewers`)
    } catch (err) {
      this.logger.error('Failed to update points', err)
    }
  }
}
