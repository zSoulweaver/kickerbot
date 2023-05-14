import { deserialize } from '@deepkit/type'
import { BaseSocket } from '../base-socket'
import { ChatMessageEvent } from './dto/chat-message-event.response'
import { CHAT_EVENT_NAME } from '../wclient.constants'

export class ChatroomSocket extends BaseSocket {
  async listenToChatroom(chatroomId: string) {
    await new Promise<void>((resolve, reject) => {
      const subscribedChannel = this._wsClient.pusher.subscribe(`chatrooms.${chatroomId}.v2`)

      subscribedChannel.bind('pusher:subscription_error', () => {
        throw new Error('Failed to subscribe to channel')
      })

      subscribedChannel.bind('pusher:subscription_succeeded', () => {
        subscribedChannel.bind(CHAT_EVENT_NAME, data => { this.handleChatMessage(data) })
        resolve()
      })
    })
  }

  private handleChatMessage(data: Record<string, unknown>) {
    const chatMessage = deserialize<ChatMessageEvent>(data)
    this._client.emit('onMessage', chatMessage)
  }
}
