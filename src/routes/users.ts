import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return await knex('users').select()
  })
  app.post('/', async (request, reply) => {
    const createUsersBodySchema = z.object({
      name: z.string(),
    })
    const { name } = createUsersBodySchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
    })
    return reply.status(201).send()
  })
}
