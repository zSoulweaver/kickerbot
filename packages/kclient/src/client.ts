import { EventEmitter } from 'tseep'
import { ChannelsEndpoint } from './api/channels/channels-endpoint'
import { MessagesEndpoint } from './api/messages/messages-endpoint'
import { UserEndpoint } from './api/user/user-endpoint'
import { ChatMessageEvent } from './ws'
import { ApiClient } from './api/client'
import { AuthEndpoint } from './api/auth/auth-endpoint'
import { ChatroomSocket } from './ws/chatroom/chatroom-socket'
import { WsClient } from './ws/client'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type KickClientEvents = {
  'wsConnected': () => void
  'onMessage': (messageData: ChatMessageEvent) => void
}

export class KickClient extends EventEmitter<KickClientEvents> {
  private _apiClient: ApiClient
  private _wsClient: WsClient

  public async initialiseApiClient(options?: { headless: boolean }) {
    this._apiClient = await ApiClient.create(this, options)
  }

  public async authenticate(credentials: { email: string, password: string }) {
    await this._apiClient.authenticate(credentials)
  }

  public async initaliseWsClient() {
    this._wsClient = new WsClient()
    this._wsClient.pusher.connection.bind('connected', () => this.emit('wsConnected'))
  }

  get api() {
    return {
      auth: new AuthEndpoint(this, this._apiClient),
      user: new UserEndpoint(this, this._apiClient),
      channels: new ChannelsEndpoint(this, this._apiClient),
      messages: new MessagesEndpoint(this, this._apiClient)
    }
  }

  get ws() {
    return {
      chatroom: new ChatroomSocket(this, this._wsClient)
    }
  }
}
