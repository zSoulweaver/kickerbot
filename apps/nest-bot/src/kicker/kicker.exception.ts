
export class KickerException extends Error {
  constructor(
    private readonly responseBody: string,
    readonly outputToChat: boolean = false
  ) {
    super()
    this.message = responseBody
  }
}
