import { Provider } from '@nestjs/common'
import { KickerModuleOptions } from './kicker-options.interface'
import { KickClient } from '@kickerbot/kclient'
import { KICKER_MODULE_OPTIONS } from './kicker.constants'

export const KickerClientProvider: Provider<KickClient> = {
  provide: KickClient,
  useFactory: (options: KickerModuleOptions) => new KickClient(),
  inject: [KICKER_MODULE_OPTIONS]
}
