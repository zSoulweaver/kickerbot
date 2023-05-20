import { BaseExceptionFilter } from '@nestjs/core'
import { KickerException } from './kicker.exception'
import { ArgumentsHost, Catch } from '@nestjs/common'

@Catch(KickerException)
export class KickerExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    if (exception instanceof KickerException) {
      throw exception
    }
  }
}
