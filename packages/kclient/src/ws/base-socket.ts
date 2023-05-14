import { KickClient } from '..'
import { WsClient } from './client'

export class BaseSocket {
  protected readonly _client: KickClient
  protected readonly _wsClient: WsClient

  constructor(client: KickClient, wsClient: WsClient) {
    this._client = client
    this._wsClient = wsClient
  }
}
