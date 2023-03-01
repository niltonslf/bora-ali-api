import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_private').defaultTo(0)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
