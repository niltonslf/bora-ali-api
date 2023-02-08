import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'

export default class extends BaseSeeder {
  public async run() {
    await Category.createMany([
      { name: 'Bar' },
      { name: 'Balada' },
      { name: 'Show' },
      { name: 'Esporte' },
      { name: 'Congresso e Palestra' },
      { name: 'Workshop' },
      { name: 'Gastronomia' },
      { name: 'Idiomas' },
      { name: 'Games e Geek' },
      { name: 'Moda e Beleza' },
      { name: 'Saúde e Bem-Estar' },
      { name: 'Infantil' },
      { name: 'Encontro de amigos' },
      { name: 'Outros' },
    ])
  }
}
