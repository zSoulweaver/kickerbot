import { KickerBaseDiscovery } from '../context'

export interface CommandGroupMeta {
  name: string
  description?: string
}

export class CommandGroupDiscovery extends KickerBaseDiscovery<CommandGroupMeta> {
  public getName() {
    return this.meta.name
  }

  public getDescription() {
    return this.meta.description
  }

  public isCommandGroup(): this is CommandGroupDiscovery {
    return true
  }

  public override toJSON(): Record<string, any> {
    return this.meta
  }
}
