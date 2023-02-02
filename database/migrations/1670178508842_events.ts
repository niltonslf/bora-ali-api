import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.string('name')
      table.text('description')
      table.string('lat')
      table.string('lng')
      table.string('address')
      table.string('price')
      table.boolean('has_meal')
      table.string('start_date')
      table.string('end_date')

      table.integer('music_style_id').unsigned().references('music_styles.id').onDelete('CASCADE')
      table.integer('place_type_id').unsigned().references('place_types.id').onDelete('CASCADE')

      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
