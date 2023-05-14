import { deserialize } from '@deepkit/type'
import { BaseEndpoint } from '../base-endpoint'
import { MessagesSendInput, MessagesSendOriginalMessageInput } from './dto/send.input'
import { MessagesSendResponse } from './dto/send.response'

export class MessagesEndpoint extends BaseEndpoint {
  async send(chatroomId: string, content: string, originalMessage?: MessagesSendOriginalMessageInput) {
    const type = originalMessage ? 'reply' : 'message'
    const postBody: MessagesSendInput = {
      content,
      type,
      metadata: originalMessage
    }

    const sendRequest = await this._apiClient.post(`/api/v2/messages/send/${chatroomId}`, postBody)
    const send = deserialize<MessagesSendResponse>(await sendRequest.json())
    return send
  }
}
