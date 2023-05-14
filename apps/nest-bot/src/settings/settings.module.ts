import { DynamicModule, Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { SettingsService } from './settings.service'
import { SETTINGS_MODULE_NAME_METADATA } from './settings.constants'

@Module({})
export class SettingsModule {
  static register(moduleName: string): DynamicModule {
    return {
      module: SettingsModule,
      providers: [
        {
          provide: SETTINGS_MODULE_NAME_METADATA,
          useValue: moduleName
        },
        SettingsService,
        PrismaService
      ],
      exports: [
        SettingsService
      ]
    }
  }
}
