import { ConfigurableModuleBuilder } from '@nestjs/common'
import { KickerModuleOptions } from './kicker-options.interface'

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN: KICKER_MODULE_OPTIONS,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<KickerModuleOptions>().setClassMethodName('forRoot').setFactoryMethodName('createKickerOptions').build()

export const COMMAND_GROUP_METADATA = 'kicker:command_group_meta'
export const COMMAND_METADATA = 'kicker:command_meta'
export const LISTENERS_METADATA = 'kicker:listeners_meta'
