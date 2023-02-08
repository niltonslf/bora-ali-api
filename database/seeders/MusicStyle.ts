import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import MusicStyle from 'App/Models/MusicStyle'

export default class extends BaseSeeder {
  public async run() {
    await MusicStyle.createMany([
      { name: 'Rock' },
      { name: 'Pop' },
      { name: 'Sertanejo' },
      { name: 'Funk' },
      { name: 'Gospel' },
      { name: 'Rap' },
      { name: 'Axé' },
      { name: 'Samba' },
      { name: 'Eletrônica' },
      { name: 'Reggae' },
      { name: 'Trance' },
      { name: 'Trap' },
      { name: 'Vários' },
      { name: 'Sem música' },
    ])
  }
}
