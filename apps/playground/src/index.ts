import 'dotenv/config'
import { KickClient } from '@kickerbot/kclient'

async function main() {
  try {
    const client = new KickClient()
    await client.initialiseApiClient()

    await client.authenticate({
      email: process.env.kick_email as string,
      password: process.env.kick_password as string
    })

    await client.ws.chatroom.listenToChatroom('2915325')

    client.on('onMessage', chatMessage => {
      console.log(chatMessage)
    })
  } catch (err) {
    console.log(err)
  }
}

void main()
