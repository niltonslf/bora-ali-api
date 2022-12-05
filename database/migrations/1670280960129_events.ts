import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('owner')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
