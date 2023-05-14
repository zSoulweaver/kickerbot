import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { CommandContext, KickerExecutionContext } from 'src/kicker/context'

export const Sender = createParamDecorator((_, context: ExecutionContext) => {
  const kickerContext = KickerExecutionContext.create(context)
  const [messageData] = kickerContext.getContext<CommandContext>()

  return messageData.sender
})
