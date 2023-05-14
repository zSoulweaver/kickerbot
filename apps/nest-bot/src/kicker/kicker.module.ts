import { Global, Logger, Module, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
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
  private readonly logger = new Logger(KickerModule.name)

  public constructor(
    private readonly client: KickClient,
    private readonly appConfig: AppConfig
  ) {
    super()
  }

  public async onApplicationBootstrap() {
    await this.client.initialiseApiClient()
    await this.client.authenticate({
      email: this.appConfig.kick.username,
      password: this.appConfig.kick.password
    })

    await this.client.initaliseWsClient()

    this.client.on('wsConnected', async () => {
      const chatroomDetails = await this.client.api.channels.chatroom(this.appConfig.kick.channel)
      await this.client.ws.chatroom.listenToChatroom(chatroomDetails.id.toString())
      this.logger.log(`Connected to channel: ${this.appConfig.kick.channel} (${chatroomDetails.id.toString()})`)
    })
  }

  onApplicationShutdown(signal?: string | undefined) {
    console.log('Kicker Module Shutdown')
  }
}
