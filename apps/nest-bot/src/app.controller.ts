import { Controller, Get, Param } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) { }

  @Get()
  getHello(): string {
    return 'Hello'
  }

  @Get('/commands')
  getCommands() {
    return this.appService.getCommandList()
  }

  @Get('/commands/:group')
  getCommandsFromGroup(@Param() params: { group: string }) {
    const commandList = this.appService.getCommandList(params.group)
    return commandList
  }
}
