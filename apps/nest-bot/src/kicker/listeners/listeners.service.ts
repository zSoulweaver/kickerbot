import { Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common'
import { ExplorerService } from '../kicker-explorer.service'
import { LISTENERS_METADATA } from '../kicker.constants'
import { ListenerDiscovery } from './listeners.discovery'
import { ChatMessageEvent, KickClient, KickClientEvents } from '@kickerbot/kclient'
import { CommandDiscovery } from '../commands'

@Injectable()
export class ListenersService implements OnModuleInit, OnApplicationBootstrap {
  private readonly logger = new Logger(ListenersService.name)

  public constructor(
    private readonly client: KickClient,
    private readonly explorerService: ExplorerService
  ) { }

  async onModuleInit() {
    const listeners = await this.explorerService.explore<ListenerDiscovery>(LISTENERS_METADATA)
    for (const listener of listeners) {
      this.client[listener.getType()](listener.getEvent() as keyof KickClientEvents, (...args) => {
        void listener.execute(args)
      })
    }
  }

  onApplicationBootstrap() {
    // Custom Events
  }

  public async commandExecuted(handler: CommandDiscovery, messageEvent: ChatMessageEvent) {
    const listeners = await this.explorerService.explore<ListenerDiscovery>(LISTENERS_METADATA)
    for (const listener of listeners) {
      if (listener.getType() === 'on' && listener.getEvent() === 'onCommandExecuted') {
        void listener.execute([handler, messageEvent])
      }
    }
  }
}
