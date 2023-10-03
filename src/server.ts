import Fastify from 'fastify'
import { env } from './env/index'

import { usersRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'

const app = Fastify()

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Running')
  })
