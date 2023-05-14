import { KickerParamType } from '../kicker-paramtype.enum'
import { createKickerParamDecorator } from './params.util'

export const Context = createKickerParamDecorator(KickerParamType.CONTEXT)

export const Ctx = Context
