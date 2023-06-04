import { ChatMessageEvent, KickClientEvents } from '@kickerbot/kclient'
import { CommandDiscovery } from '../commands'

export interface KickerEvents extends KickClientEvents {
  'onCommandExecuted': (command: CommandDiscovery, messageEvent: ChatMessageEvent) => void
}
