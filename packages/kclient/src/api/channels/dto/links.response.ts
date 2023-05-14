export class ChannelLinksResponse {
  id: number
  channel_id: number
  description: string
  link: string
  created_at: Date
  updated_at: Date
  order: number
  title: string
  image?: {
    url: string
    responsive: string
  }
}
