import { ChatMessageEvent } from '@kickerbot/kclient'
import { KickerEvents } from '../listeners/listener.interface'

export type CommandContext = [ChatMessageEvent]

export type ContextOf<K extends keyof E, E = KickerEvents> = E[K] extends (...args: infer U) => any ? U : any
