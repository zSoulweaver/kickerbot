import { deserialize } from '@deepkit/type'
import { UserResponse } from './dto/user.response'
import { BaseEndpoint } from '../base-endpoint'

export class UserEndpoint extends BaseEndpoint {
  async me() {
    const userRequest = await this._apiClient.get('/api/v1/user')
    const user = deserialize<UserResponse>(await userRequest.json())
    return user
  }
}
