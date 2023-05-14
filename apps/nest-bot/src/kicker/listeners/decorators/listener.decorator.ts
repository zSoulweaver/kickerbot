import { SetMetadata } from '@nestjs/common'
import { ListenerDiscovery, ListenerMeta } from '../listeners.discovery'
import { LISTENERS_METADATA } from 'src/kicker/kicker.constants'
import { KickerEvents } from '../listener.interface'

export const Listener = (options: ListenerMeta) => SetMetadata<string, ListenerDiscovery>(LISTENERS_METADATA, new ListenerDiscovery(options))

export const On = <K extends keyof E, E = KickerEvents>(event: K) => Listener({ type: 'on', event })
export const Once = <K extends keyof E, E = KickerEvents>(event: K) => Listener({ type: 'once', event })
