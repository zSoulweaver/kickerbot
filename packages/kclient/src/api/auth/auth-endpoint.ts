import { deserialize } from '@deepkit/type'
import { BaseEndpoint } from '../base-endpoint'
import { KickTokenProviderResponse } from './dto/kick-token-provider.response'

export class AuthEndpoint extends BaseEndpoint {
  async tokenProvider() {
    const loginTokensRequest = await this._apiClient.get('/kick-token-provider')
    const loginTokens = deserialize<KickTokenProviderResponse>(await loginTokensRequest.json())

    return loginTokens
  }

  async login(credentials: { email: string, password: string }) {
    const loginTokens = await this.tokenProvider()
    const login = await this._apiClient.post('/mobile/login', {
      email: credentials.email,
      password: credentials.password,
      [loginTokens.nameFieldName]: '',
      [loginTokens.validFromFieldName]: loginTokens.encryptedValidFrom
    })

    if (login.status() !== 204) {
      throw Error('Unable to login')
    }
  }
}
