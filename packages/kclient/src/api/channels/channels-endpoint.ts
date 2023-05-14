import { deserialize } from '@deepkit/type'
import { BaseEndpoint } from '../base-endpoint'
import { ChannelResponse } from './dto/channel.response'
import { ChannelLinksResponse } from './dto/links.response'
import { ChannelChatroomResponse } from './dto/chatroom.response'
import { ChannelLeaderboardsResponse } from './dto/leaderboards.response'

export class ChannelsEndpoint extends BaseEndpoint {
  async channel(username: string) {
    const channelRequest = await this._apiClient.get(`/api/v2/channels/${username}`)
    const channel = deserialize<ChannelResponse>(await channelRequest.json())
    return channel
  }

  async links(username: string) {
    const linksRequest = await this._apiClient.get(`/api/v2/channels/${username}/links`)
    const links = deserialize<ChannelLinksResponse[]>(await linksRequest.json())
    return links
  }

  async chatroom(username: string) {
    const chatroomRequest = await this._apiClient.get(`/api/v2/channels/${username}/chatroom`)
    const chatroom = deserialize<ChannelChatroomResponse>(await chatroomRequest.json())
    return chatroom
  }

  async polls(username: string) {
    const pollsRequest = await this._apiClient.get(`/api/v2/channels/${username}/polls`)
    return pollsRequest
  }

  async leaderboards(username: string) {
    const leaderboardsRequest = await this._apiClient.get(`/api/v2/channels/${username}/leaderboards`)
    const leaderboards = deserialize<ChannelLeaderboardsResponse>(await leaderboardsRequest.json())
    return leaderboards
  }
}
