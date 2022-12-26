import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.string('name')
      table.string('description')
      table.integer('lat')
      table.integer('lng')
      table.string('address')
      table.string('price')
      table.boolean('has_meal')
      table.string('music_style')
      table.string('place_type')
      table.dateTime('start_date')
      table.dateTime('end_date')

      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
