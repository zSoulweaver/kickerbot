export class UserResponse {
  id: number
  email: string
  username: string
  google_id?: unknown
  agreed_to_terms: boolean
  email_verified_at: Date
  bio?: unknown
  country?: unknown
  state?: unknown
  city?: unknown
  enable_live_notifications: boolean
  instagram?: unknown
  twitter?: unknown
  youtube?: unknown
  discord?: unknown
  tiktok?: unknown
  facebook?: unknown
  enable_onscreen_live_notifications: boolean
  apple_id?: unknown
  email_updated_at?: unknown
  country_code?: unknown
  profilepic?: string
  is_2fa_setup: boolean
  redirect?: unknown
  channel_can_be_updated: boolean
  is_live: boolean
  roles: unknown[]
  streamer_channel: {
    id: number
    user_id: number
    slug: string
    is_banned: boolean
    playback_url?: unknown
    name_updates_at?: unknown
    vod_enabled: boolean
    subscription_enabled: boolean
    cf_rate_limiter: string
    can_host: boolean
  }
}
