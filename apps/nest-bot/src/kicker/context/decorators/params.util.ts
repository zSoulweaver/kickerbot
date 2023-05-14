import { PipeTransform, Type, assignMetadata } from '@nestjs/common'
import { KickerParamType } from '../kicker-paramtype.enum'
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants'

export function createKickerParamDecorator(type: KickerParamType) {
  return (...pipes: Array<Type<PipeTransform> | PipeTransform>): ParameterDecorator => (target, key, index) => {
    const args: any = Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key as string) ?? {}

    Reflect.defineMetadata(ROUTE_ARGS_METADATA, assignMetadata(args, type, index, undefined, ...pipes), target.constructor, key as string)
  }
}
