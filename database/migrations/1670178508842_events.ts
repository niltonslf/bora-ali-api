import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('createdAt', { useTz: true })
      table.timestamp('updatedAt', { useTz: true })
      table.string('name')
      table.string('description')
      table.integer('lat')
      table.integer('lng')
      table.string('address')
      table.string('price')
      table.boolean('hasMeal')
      table.string('musicStyle')
      table.string('placeType')
      table.dateTime('startDate')
      table.dateTime('endDate')

      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
