import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PlaceType from 'App/Models/PlaceType'

export default class extends BaseSeeder {
  public async run() {
    PlaceType.createMany([
      {
        description: 'Espaços como parques, galerias, feiras...',
        name: 'Espaço aberto',
      },
      {
        description: 'Espaços como galpões, baladas, bares...',
        name: 'Espaço fechado',
      },
    ])
  }
}
