import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'images'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.string('image')
      table.integer('event_id').unsigned().references('events.id').onDelete('CASCADE') // delete post when user is deleted
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
