import { Injectable } from '@nestjs/common'
import { KickerBaseDiscovery, KickerParamsFactory } from './context'
import { ExternalContextCreator, Reflector } from '@nestjs/core'
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants'
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants'
import { DiscoveredClassWithMeta, DiscoveredMethodWithMeta, DiscoveryService } from '@golevelup/nestjs-discovery'

@Injectable()
export class ExplorerService extends Reflector {
  private readonly kickerParamsFactory = new KickerParamsFactory()

  public constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly externalContextCeator: ExternalContextCreator
  ) {
    super()
  }

  public async explore<T extends KickerBaseDiscovery>(metadataKey: string): Promise<T[]> {
    const methods = await this.discoveryService.providerMethodsWithMetaAtKey<T>(metadataKey)
    return methods.flatMap(method => this.filterProperties(method))
  }

  public async exploreProviders<T extends KickerBaseDiscovery>(metadataKey: string): Promise<Array<DiscoveredClassWithMeta<T>>> {
    const classes = await this.discoveryService.providersWithMetaAtKey<T>(metadataKey)
    return classes.flatMap(baseClass => this.filterClassProperties(baseClass))
  }

  public async exploreMethodsOnProvider<T extends KickerBaseDiscovery>(discoveredClass: DiscoveredClassWithMeta<any>, methodMetadataKey: string): Promise<T[]> {
    const methods = this.discoveryService.classMethodsWithMetaAtKey<T>(discoveredClass.discoveredClass, methodMetadataKey)
    return methods.flatMap(method => this.filterProperties(method))
  }

  private filterProperties<T extends KickerBaseDiscovery>(method: DiscoveredMethodWithMeta<T>) {
    const item = method.meta

    item.setDiscoverMeta({ class: method.discoveredMethod.parentClass.instance.constructor, handler: method.discoveredMethod.handler })
    item.setContextCallback(this.externalContextCeator.create(
      method.discoveredMethod.parentClass.instance,
      method.discoveredMethod.handler,
      method.discoveredMethod.methodName,
      ROUTE_ARGS_METADATA,
      this.kickerParamsFactory,
      STATIC_CONTEXT,
      undefined,
      { guards: true, filters: true, interceptors: true },
      'kicker'
    ))

    return item
  }

  private filterClassProperties<T extends KickerBaseDiscovery>(baseClass: DiscoveredClassWithMeta<T>) {
    const item = baseClass.meta

    item.setDiscoverMeta({ className: baseClass.discoveredClass.name })

    return baseClass
  }
}
