import { Reflector } from '@nestjs/core'
import { CommandDiscovery } from '../commands/command.discovery'
import { CommandGroupDiscovery } from '../commands/command-group.discovery'

interface DiscoveredItem {
  class?: any
  className?: string
  handler?: (...args: any[]) => any
}

export abstract class KickerBaseDiscovery<T = any> {
  protected readonly reflector = new Reflector()
  protected discovery: DiscoveredItem
  // eslint-disable-next-line @typescript-eslint/ban-types
  protected contextCallback: Function

  public constructor(protected readonly meta: T) { }

  public getClass() {
    return this.discovery.class
  }

  public getClassName() {
    return this.discovery.className
  }

  public getHandler() {
    return this.discovery.handler
  }

  public setDiscoverMeta(meta: DiscoveredItem) {
    this.discovery ??= meta
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public setContextCallback(fn: Function) {
    this.contextCallback ??= fn
  }

  public async execute(context: any = []) {
    return this.contextCallback(context, this)
  }

  public isCommandGroup(): this is CommandGroupDiscovery {
    return false
  }

  public isCommand(): this is CommandDiscovery {
    return false
  }

  public abstract toJSON(): Record<string, any>
}
