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
  app.get('/:id', async (request, reply) => {
    const getIdUserMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getIdUserMealsParamsSchema.parse(request.params)

    const mealsId = await knex('meals').where('user_id', id)
    if (!mealsId) {
      return reply.status(400).send('users does not exist')
    }

    const formattedMetrics = {}
    const metrics = {
      Total: await knex('meals').where('user_id', id).count(),
      DietOn: await knex('meals').where('user_id', id).where('diet', 1).count(),
      DietOff: await knex('meals')
        .where('user_id', id)
        .where('diet', 0)
        .count(),
    }
    let tot = 0
    let seq = 0
    await knex('meals')
      .where('user_id', id)
      .then((rows) => {
        rows.forEach((row) => {
          if (row.diet === 1) {
            seq++
            if (tot < seq) tot = seq
          } else seq = 0
        })
      })
    for (const key of Object.keys(metrics)) {
      const count = metrics[key][0]['count(*)']
      formattedMetrics[key] = count
    }

    return reply
      .status(200)
      .send({ Metrics: formattedMetrics, BestSequencie: tot })
  })
}
