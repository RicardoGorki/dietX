// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      created_at: string
    }
    meals: {
      id: string
      user_id: string
      name: string
      description: string
      diet: boolean
      created_at: string
      updated_at: string
    }
  }
}
