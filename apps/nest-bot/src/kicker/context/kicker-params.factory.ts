import { ParamData } from '@nestjs/common'
import { KickerBaseDiscovery } from './kicker-base.discovery'
import { KickerParamType } from './kicker-paramtype.enum'
import { ParamsFactory } from '@nestjs/core'

export class KickerParamsFactory implements ParamsFactory {
  public exchangeKeyForValue(type: number, data: ParamData, args?: [any[], KickerBaseDiscovery]) {
    if (!args) return null

    switch (type as KickerParamType) {
      case KickerParamType.CONTEXT:
        return args[0]
      case KickerParamType.DISCOVERY:
        return args[1]
      default:
        return null
    }
  }
}
