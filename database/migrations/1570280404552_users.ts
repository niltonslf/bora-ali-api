import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('createdAt', { useTz: true })
      table.timestamp('updatedAt', { useTz: true })
      table.string('name')
      table.string('email')
      table.string('profilePicture')
      table.string('uuid')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
