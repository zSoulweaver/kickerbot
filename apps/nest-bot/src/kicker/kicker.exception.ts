
export class KickerException extends Error {
  silent: boolean

  constructor(
    private readonly responseBody: string,
    private readonly isSilent: boolean = true
  ) {
    super()
    this.message = responseBody
    this.silent = isSilent
  }
}
