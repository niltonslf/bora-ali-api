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
      table.string('image')
      table.string('owner')
      table.string('coords')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
