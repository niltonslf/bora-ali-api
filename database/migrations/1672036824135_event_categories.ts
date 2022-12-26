import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'category_event'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.integer('event_id').unsigned().references('events.id')
      table.integer('category_id').unsigned().references('categories.id')
      table.unique(['event_id', 'category_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
