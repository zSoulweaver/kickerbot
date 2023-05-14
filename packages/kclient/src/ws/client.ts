import Pusher, { Options } from 'pusher-js'
import { PUSHER_APP_KEY } from './wclient.constants'

export class WsClient {
  pusher: Pusher

  constructor() {
    Pusher.logToConsole = false
    const pusherOptions: Options = {
      cluster: 'us2'
    }

    this.pusher = new Pusher(PUSHER_APP_KEY, pusherOptions)
  }
}
