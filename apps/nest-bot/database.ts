import EmbeddedPostgres from 'embedded-postgres'

async function main() {
  const pg = new EmbeddedPostgres({
    database_dir: './kickerbotdb',
    user: 'kickerbot',
    password: 'kickerbot',
    port: 5500
  })
  await pg.start()
}

void main()
