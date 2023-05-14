import { MessagesMessageMetadata } from '../../../'

export class ChatMessageEvent {
  id: string
  chatroom_id: number
  content: string
  type: string
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

  getMetadata(): MessagesMessageMetadata {
    return {
      original_message: {
        content: this.content,
        id: this.id
      },
      original_sender: {
        id: this.sender.id,
        username: this.sender.username
      }
    }
  }
}
