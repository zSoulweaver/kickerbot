import { Global, Module } from '@nestjs/common'
import { ViewersService } from './viewers.service'
import { PrismaService } from 'src/prisma.service'
import { ViewerActivityService } from './viewer-activity.service'

@Global()
@Module({
  providers: [
    PrismaService,
    ViewersService,
    ViewerActivityService
  ],
  exports: [
    ViewersService,
    ViewerActivityService
  ]
})
export class ViewersModule { }
