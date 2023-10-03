import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const meals = await knex('meals').select()
    return { meals }
  })
  app.get('/:id', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getMealsParamsSchema.parse(request.params)
    const meals = await knex('meals').where('id', id).first().select()

    if (!meals) {
      return reply.status(404).send('meals does not exist')
    }
    return { meals }
  })
  app.get('/:userId/users', async (request, reply) => {
    const getUsersParamsSchema = z.object({
      userId: z.string().uuid(),
    })
    const { userId } = getUsersParamsSchema.parse(request.params)

    const meals = await knex('meals').where('user_id', userId).select()
    if (!meals) {
      return reply.status(400).send('users does not exist')
    }

    return { meals }
  })
  app.post('/:userId', async (request, reply) => {
    const getUsersParamsSchema = z.object({
      userId: z.string().uuid(),
    })
    const { userId } = getUsersParamsSchema.parse(request.params)

    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      diet: z.boolean(),
    })

    const { name, description, diet } = createMealsBodySchema.parse(
      request.body,
    )

    const users = await knex('users').where('id', userId).first()

    if (!users) {
      return reply.status(400).send('users does not exist')
    }

    await knex('meals').insert({
      id: randomUUID(),
      name,
      user_id: users.id,
      description,
      diet,
    })
    return reply.status(201).send()
  })
  app.put('/:userId/:id', async (request, reply) => {
    const getIdUserMealsParamsSchema = z.object({
      userId: z.string().uuid(),
      id: z.string().uuid(),
    })
    const { userId, id } = getIdUserMealsParamsSchema.parse(request.params)

    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      diet: z.boolean(),
    })

    const { name, description, diet } = createMealsBodySchema.parse(
      request.body,
    )

    const mealsId = await knex('meals')
      .where('user_id', userId)
      .where('id', id)
      .first()
    if (!mealsId) {
      return reply.status(400).send('users or meals does not exist')
    }
    await knex('meals')
      .update({
        name,
        description,
        diet,
        updated_at: knex.fn.now(),
      })
      .where('id', id)
    return reply.status(201).send()
  })
  app.delete('/:userId/:id', async (request, reply) => {
    const getIdUserMealsParamsSchema = z.object({
      userId: z.string().uuid(),
      id: z.string().uuid(),
    })
    const { userId, id } = getIdUserMealsParamsSchema.parse(request.params)

    const mealsId = await knex('meals')
      .where('user_id', userId)
      .where('id', id)
      .first()
    if (!mealsId) {
      return reply.status(400).send('users or meals does not exist')
    }
    await knex('meals').delete().where('id', id)
    return reply.status(201).send()
  })
}
