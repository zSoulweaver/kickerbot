import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class ViewersService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async get(query: { id?: number, username?: string }) {
    const viewer = await this.prisma.viewer.findFirst({
      where: query
    })
    return viewer
  }

  async insert(viewerInput: Prisma.ViewerCreateInput) {
    const viewer = await this.prisma.viewer.create({
      data: viewerInput
    })
    return viewer
  }

  async upsert(newViewer: Prisma.ViewerCreateInput) {
    const viewer = await this.prisma.viewer.upsert({
      where: newViewer,
      update: newViewer,
      create: newViewer
    })
    return viewer
  }
}
