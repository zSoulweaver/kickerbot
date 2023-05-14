import { MessagesMessageMetadata } from './message-metadata'

export class MessagesSendResponse {
  status: {
    error: boolean
    code: number
    message: string
  }

  data: {
    id: string
    chatroom_id: number
    content: string
    type: 'message' | 'reply'
    created_at: Date
    sender: {
      id: number
      username: string
      slug: string
      identity: {
        color: string
        badges: Array<{
          type: string
          text: string
        }>
      }
    }

    metadata: MessagesMessageMetadata
  }
}
