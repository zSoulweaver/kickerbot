import { Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common'
import { ExplorerService } from '../kicker-explorer.service'
import { LISTENERS_METADATA } from '../kicker.constants'
import { ListenerDiscovery } from './listeners.discovery'
import { KickClient } from '@kickerbot/kclient'

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
      this.client[listener.getType()](listener.getEvent(), (...args) => {
        void listener.execute(args)
      })
    }
  }

  onApplicationBootstrap() {
    // Custom Events
  }
}
