import { Browser, BrowserContext, Cookie, Page, Response } from 'playwright'
import { chromium } from 'playwright-extra'
import stealthPlugin from 'puppeteer-extra-plugin-stealth'
import { resolve } from 'path'
import { outputJSON, readJson } from 'fs-extra'
import { KickClient } from '../client'

export interface CurrentUserDetails {
  username: string
  email: string
}

const blockedResources = [
  // Assets
  '*/favicon.ico',
  // '.css',
  '.jpg',
  '.jpeg',
  '.png',
  '.svg',
  '.woff',
  '.woff2',
  '.webp',

  // Analytics and other fluff
  'q.stripe.com'
]

class KickSessionError extends Error {
  constructor(message) {
    super(message)
    this.name = 'KickSessionError'
  }
}

export class ApiClient {
  private readonly _client: KickClient
  private readonly baseFetchUrl = 'https://kick.com'
  private browser: Browser
  private page: Page
  private context: BrowserContext
  private currentUser: CurrentUserDetails | undefined

  private constructor(client: KickClient) {
    this._client = client
    chromium.use(stealthPlugin())
  }

  public static async create(kickClient: KickClient, options?: { headless: boolean }) {
    const client = new ApiClient(kickClient)
    await client.initialiseBrowser(options)
    return client
  }

  private async initialiseBrowser(options?: { headless: boolean }) {
    this.browser = await chromium.launch({
      headless: options?.headless ?? true,
      devtools: options?.headless ?? false
    })
    this.context = await this.browser.newContext()
    this.page = await this.context.newPage()
    const client = await this.page.context().newCDPSession(this.page)
    await client.send('Network.setBlockedURLs', { urls: blockedResources })
    await client.send('Network.enable')
    await this.page.goto(`${this.baseFetchUrl}/community-guidelines`)
  }

  private async restoreSession(targetEmail: string): Promise<void> {
    try {
      const userPath = resolve(process.cwd(), '.kclient/user.json')
      const cookiePath = resolve(process.cwd(), '.kclient/cookies.json')

      const userInfo: CurrentUserDetails = await readJson(userPath)
      const cookieData: Cookie[] = await readJson(cookiePath)

      if (userInfo.email !== targetEmail) {
        throw new KickSessionError('Session email does not match supplied credentials')
      }

      await this.context.addCookies(cookieData)
      const currentUser = await this._client.api.user.me()
      if (!currentUser?.id) {
        throw new KickSessionError('Invalid session')
      }
      this.currentUser = {
        username: currentUser.username,
        email: currentUser.email
      }
    } catch (err) {
      if (err instanceof KickSessionError) {
        throw err
      }
      throw new KickSessionError('Unknown error restoring session')
    }
  }

  private async dumpSession(): Promise<void> {
    const cookies = await this.context.cookies()
    const cookiePath = resolve(process.cwd(), '.kclient/cookies.json')
    const userPath = resolve(process.cwd(), '.kclient/user.json')

    await outputJSON(cookiePath, cookies)
    await outputJSON(userPath, this.currentUser)
  }

  async browserFetch(url: string, fetchOptions?: RequestInit): Promise<Response> {
    const cookies = await this.context.cookies()
    let xsrfToken = cookies.find(x => x.name === 'XSRF-TOKEN')?.value
    if (xsrfToken !== undefined) {
      xsrfToken = decodeURIComponent(xsrfToken)
    }

    return await new Promise((resolve, reject) => {
      if (xsrfToken === undefined) {
        reject(new Error('Unable to get token from cookies'))
        return
      }

      const handler = (res: Response) => {
        void (async () => {
          if (res.url().endsWith(url)) {
            this.page.off('response', handler)
            resolve(res)
          }
        })()
      }
      this.page.on('response', handler)

      const defaultOptions: RequestInit = {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'accept-language': 'en-GB',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${xsrfToken}`,
          'X-XSRF-TOKEN': xsrfToken
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      void this.page.evaluate<void, [string, RequestInit]>(([url, fetchOptions]) => {
        void fetch(url, fetchOptions)
      }, [url, { ...defaultOptions, ...fetchOptions }])

      setTimeout(() => {
        this.page.off('response', handler)
        reject(new Error('Timeout'))
      }, 5000)
    })
  }

  async get(url: string, fetchOptions?: RequestInit) {
    return await this.browserFetch(url, fetchOptions)
  }

  async post(url: string, body: Record<string, any>, fetchOptions?: RequestInit) {
    const jsonBody = JSON.stringify(body)
    return await this.browserFetch(url, {
      body: jsonBody,
      method: 'POST',
      ...fetchOptions
    })
  }

  async authenticate(credentials: { email: string, password: string }) {
    try {
      await this.restoreSession(credentials.email)
      return
    } catch (err) {}

    try {
      await this._client.api.auth.login(credentials)
      const currentUser = await this._client.api.user.me()
      this.currentUser = {
        username: currentUser.username,
        email: currentUser.email
      }
      await this.dumpSession()
    } catch (err) {
      throw new Error('Unable to authenticate')
    }
  }

  get currentUserDetails() {
    return this.currentUser
  }
}
