import { MessagesMessageMetadata } from './message-metadata'

export type MessagesSendOriginalMessageInput = MessagesMessageMetadata

export interface MessagesSendInput {
  content: string
  type: 'reply' | 'message'
  metadata?: MessagesSendOriginalMessageInput
}
