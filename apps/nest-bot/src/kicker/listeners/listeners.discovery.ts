import { KickerBaseDiscovery } from '../context'
import { KickerEvents } from './listener.interface'

export interface ListenerMeta {
  type: 'once' | 'on'
  event: string | symbol | number
}

export class ListenerDiscovery extends KickerBaseDiscovery<ListenerMeta> {
  public getType() {
    return this.meta.type
  }

  public getEvent(): keyof KickerEvents {
    return this.meta.event.toString() as keyof KickerEvents
  }

  public isListener(): this is ListenerDiscovery {
    return true
  }

  public override toJSON(): Record<string, any> {
    return this.meta
  }
}
