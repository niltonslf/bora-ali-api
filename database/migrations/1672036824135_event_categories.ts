import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'category_event'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('event_id').unsigned().references('events.id').onDelete('CASCADE')
      table.integer('category_id').unsigned().references('categories.id').onDelete('CASCADE')

      table.unique(['event_id', 'category_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
