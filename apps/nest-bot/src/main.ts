import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from './prisma.service'
import { KickerExceptionFilter } from './kicker'

async function bootstrap() {
  // const pg = new EmbeddedPostgres({
  //   database_dir: './kickerbotdb',
  //   user: 'kickerbot',
  //   password: 'kickerbot',
  //   port: 5500
  // })
  // await pg.initialise()
  // await pg.start()
  const app = await NestFactory.create(AppModule)

  app.enableShutdownHooks()

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  app.useGlobalFilters(new KickerExceptionFilter())

  await app.listen(3000)
}
void bootstrap()
