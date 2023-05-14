import { KickClient } from '..'
import { ApiClient } from './client'

export class BaseEndpoint {
  protected readonly _client: KickClient
  protected readonly _apiClient: ApiClient

  constructor(client: KickClient, apiClient: ApiClient) {
    this._client = client
    this._apiClient = apiClient
  }
}
