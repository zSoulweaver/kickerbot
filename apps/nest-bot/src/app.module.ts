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
    KickerModule.forRoot({}),
    ScheduleModule.forRoot(),
    PointsModule,
    ViewersModule,
    PermissionsModule,
    TimersModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ]
})
export class AppModule { }
