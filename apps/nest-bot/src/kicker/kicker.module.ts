import { Global, Module, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import { DiscoveryModule as Discovery } from '@golevelup/nestjs-discovery'
import { KickerClientProvider } from './kicker-client.provider'
import { CommandsService } from './commands/commands.service'
import { ExplorerService } from './kicker-explorer.service'
import { ConfigurableModuleClass } from './kicker.constants'
import { ListenersService } from './listeners'
import { KickClient } from '@kickerbot/kclient'
import { AppConfig } from 'src/app.config'

@Global()
@Module({
  imports: [DiscoveryModule, Discovery],
  providers: [
    KickerClientProvider,
    ExplorerService,
    CommandsService,
    ListenersService
  ],
  exports: [
    KickerClientProvider,
    CommandsService,
    ListenersService,
    ExplorerService
  ]
})
export class KickerModule extends ConfigurableModuleClass implements OnApplicationBootstrap, OnApplicationShutdown {
  public constructor(
    private readonly client: KickClient,
    private readonly appConfig: AppConfig
  ) {
    super()
  }

  public async onApplicationBootstrap() {
    this.client.on('wsConnected', async () => {
      await this.client.ws.chatroom.listenToChatroom('2915325')
    })

    await this.client.initialiseApiClient()
    await this.client.authenticate({
      email: this.appConfig.kick.username,
      password: this.appConfig.kick.password
    })
  }

  onApplicationShutdown(signal?: string | undefined) {
    console.log('Kicker Module Shutdown')
  }
}
