interface LeaderboardItem {
  user_id: number
  username: string
  quantity: number
}

export class ChannelLeaderboardsResponse {
  gifts: LeaderboardItem[]
  gifts_week: LeaderboardItem[]
  gifts_month: LeaderboardItem[]
}
