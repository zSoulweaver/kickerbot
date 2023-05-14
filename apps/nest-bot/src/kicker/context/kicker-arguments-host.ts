import { ArgumentsHost } from '@nestjs/common'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { KickerContextType } from './kicker-execution-context'
import { KickerBaseDiscovery } from './kicker-base.discovery'

export class KickerArgumentsHost extends ExecutionContextHost {
  public static create(context: ArgumentsHost): KickerArgumentsHost {
    const type = context.getType()
    const kickContext = new KickerArgumentsHost(context.getArgs())
    kickContext.setType(type)
    return kickContext
  }

  public getType<TContext extends string = KickerContextType>(): TContext {
    return super.getType()
  }

  public getContext<T>(): T {
    return this.getArgByIndex(0)
  }

  public getDiscovery(): KickerBaseDiscovery {
    return this.getArgByIndex(1)
  }
}
