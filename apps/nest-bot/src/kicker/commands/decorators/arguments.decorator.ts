import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { CommandContext, KickerExecutionContext } from 'src/kicker/context'
import { ArgumentsPipe } from '../arguments-pipe'

export const LooseArguments = createParamDecorator((_, context: ExecutionContext) => {
  const kickerContext = KickerExecutionContext.create(context)
  const [messageData] = kickerContext.getContext<CommandContext>()
  const discovery = kickerContext.getDiscovery()

  if (!discovery.isCommand()) return null

  return messageData.content.split(/ +/g).slice(1 + discovery.getName().split(' ').length)
})

export const LooseArgs = LooseArguments

export const Arguments = LooseArguments(ArgumentsPipe)
export const Args = Arguments
