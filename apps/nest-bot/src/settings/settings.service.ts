import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { SETTINGS_MODULE_NAME_METADATA } from './settings.constants'

@Injectable()
export class SettingsService {
  constructor(
    @Inject(SETTINGS_MODULE_NAME_METADATA)
    private readonly moduleName: string,
    private readonly prisma: PrismaService
  ) { }

  async getSetting(setting: string, module?: string) {
    const moduleSetting = await this.prisma.moduleSettings.findFirst({
      where: {
        module: module ?? this.moduleName,
        setting
      }
    })
    return moduleSetting?.value
  }

  async initalSet(setting: string, value: string | number, module?: string) {
    await this.prisma.moduleSettings.upsert({
      where: {
        module_setting: {
          module: module ?? this.moduleName,
          setting
        }
      },
      update: {},
      create: {
        module: module ?? this.moduleName,
        setting,
        value: value.toString()
      }
    })
  }

  async set(setting: string, value: string | number, module?: string) {
    const settingData = {
      module: module ?? this.moduleName,
      setting,
      value: value.toString()
    }

    await this.prisma.moduleSettings.upsert({
      where: {
        module_setting: {
          module: module ?? this.moduleName,
          setting
        }
      },
      update: settingData,
      create: settingData
    })
  }
}
