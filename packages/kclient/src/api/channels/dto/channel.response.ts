interface LivestreamCategories {
  id: number
  category_id: number
  name: string
  slug: string
  tags: string[]
  description?: unknown
  deleted_at?: unknown
  viewers: number
  category: {
    id: number
    name: string
    slug: string
    icon: string
  }
}

export class ChannelResponse {
  id: number
  user_id: number
  slug: string
  is_banned: boolean
  playback_url?: string
  vod_enabled: true
  subscription_enabled: boolean
  cf_rate_limited: string
  followers_count: number
  following: boolean
  subscription?: unknown
  subscriber_badges?: any[]
  banner_image?: { url: string }
  livestream?: {
    id: number
    slug: string
    channel_id: number
    created_at: Date
    session_title: string
    is_live: boolean
    risk_level_id?: unknown
    source?: unknown
    twitch_channel?: unknown
    duration: number
    language: string
    is_mature: boolean
    viewer_count: number
    thumbnail: {
      url: string
    }
    categories: LivestreamCategories[]
    tags: unknown[]
  }

  role?: unknown
  muted: false
  follower_badges: unknown[]
  offline_banner_image?: unknown
  verified: boolean
  can_host: boolean
  user: {
    id: number
    username: string
    agreed_to_terms: boolean
    email_verified_at: Date
    bio: string
    country: string
    state: string
    city: string
    instagram: string
    twitter: string
    youtube: string
    discord: string
    tiktok: string
    facebook: string
    country_code?: unknown
    profile_pic?: string
  }

  chatroom: {
    id: number
    chatable_type: string
    channel_id: number
    created_at: Date
    updated_at: Date
    chat_mode_old: string
    chat_mode: string
    slow_mode: boolean
    chatable_id: number
    followers_mode: boolean
    subscribers_mode: boolean
    emotes_mode: boolean
    message_interval: number
    following_min_duration: number
  }
}
