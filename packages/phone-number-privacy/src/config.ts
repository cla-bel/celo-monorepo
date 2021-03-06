import * as functions from 'firebase-functions'
import knex from 'knex'

const DEV_MODE = process.env.NODE_ENV !== 'production' || process.env.FUNCTIONS_EMULATOR === 'true'

interface Config {
  salt: {
    key: string
  }
  db: {
    user: string
    password: string
    database: string
    host: string
  }
}

let config: Config

if (DEV_MODE) {
  console.debug('Running in dev mode')
  config = {
    salt: {
      key: 'fakeSecretKey',
    },
    db: {
      user: 'postgres',
      password: 'fakePass',
      database: 'phoneNumberPrivacy',
      host: 'fakeHost',
    },
  }
} else {
  const functionConfig = functions.config()
  config = {
    salt: {
      key: functionConfig.salt.key,
    },
    db: {
      user: functionConfig.db.username,
      password: functionConfig.db.pass,
      database: functionConfig.db.name,
      host: `/cloudsql/${functionConfig.db.host}`,
    },
  }
}

export const connectToDatabase = () => {
  console.debug('Creating knex instance')
  return knex({
    client: 'pg',
    connection: config.db,
    debug: DEV_MODE,
  })
}

export default config
