import { Logger, Module, OnModuleInit } from '@nestjs/common'
import { PointsCommands } from './points.commands'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { PointsService } from './points.service'
import { PrismaService } from 'src/prisma.service'
import { SettingsModule } from 'src/settings/settings.module'
import { SettingsObject, SettingsService } from 'src/settings/settings.service'
import { minutesToMilliseconds } from 'date-fns'
import { PointsSettings } from './points.settings'

@Module({
  imports: [
    PermissionsModule,
    SettingsModule.register(PointsModule.name)
  ],
  providers: [
    PrismaService,
    PointsCommands,
    PointsService,
    PrismaService
  ]
})
export class PointsModule implements OnModuleInit {
  private readonly logger = new Logger(PointsModule.name)

  constructor(
    private readonly settingsService: SettingsService
  ) { }

  async onModuleInit() {
    const defaultSettings: SettingsObject<PointsSettings> = {
      pointsName: 'points',
      pointsGain: 5,
      pointsGainTime: minutesToMilliseconds(1)
    }

    for (const setting in defaultSettings) {
      await this.settingsService.initalSet(setting, defaultSettings[setting])
    }

    this.logger.log('Set initial point settings')
  }
}
