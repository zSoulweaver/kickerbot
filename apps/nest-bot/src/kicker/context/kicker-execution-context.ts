import { ContextType, ExecutionContext } from '@nestjs/common'
import { KickerArgumentsHost } from './kicker-arguments-host'

export type KickerContextType = 'kicker' | ContextType

export class KickerExecutionContext extends KickerArgumentsHost {
  public static create(context: ExecutionContext): KickerExecutionContext {
    const type = context.getType()
    const kickContext = new KickerExecutionContext(
      context.getArgs(),
      context.getClass(),
      context.getHandler()
    )
    kickContext.setType(type)
    return kickContext
  }
}
