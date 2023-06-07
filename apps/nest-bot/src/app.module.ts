import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { KickerModule } from './kicker'
import { PointsModule } from './points/points.module'
import { ViewersModule } from './viewers/viewers.module'
import { PermissionsModule } from './permissions/permissions.module'
import { ScheduleModule } from '@nestjs/schedule'
import { TimersModule } from './timers/timers.module'
import { TypedConfigModule, fileLoader } from 'nest-typed-config'
import { AppConfig } from './app.config'
import { deserialize } from '@deepkit/type'
import { AliasModule } from './alias/alias.module'
import { CooldownModule } from './cooldown/cooldown.module'

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: AppConfig,
      load: fileLoader({
        basename: 'config'
      }),
      validate: (rawConfig: any) => {
        const config = deserialize<AppConfig>(rawConfig)
        return config
      }
    }),
    ScheduleModule.forRoot(),
    KickerModule.forRoot({}),
    CooldownModule,
    PointsModule,
    ViewersModule,
    PermissionsModule,
    TimersModule,
    AliasModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ]
})
export class AppModule { }
