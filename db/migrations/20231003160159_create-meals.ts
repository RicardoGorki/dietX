/* eslint-disable prettier/prettier */
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('meals', (table) => {
		table.uuid('id').primary().notNullable()
		table.uuid('user_id').references('id').inTable('users').notNullable()
		table.text('name').notNullable()
		table.text('description').notNullable()
		table.boolean('diet').notNullable().defaultTo(false)
		table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
		table.timestamp('updated_at').defaultTo(knex.fn.now()).defaultTo(null)
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('meals')
}
