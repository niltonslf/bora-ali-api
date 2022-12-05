import Route from '@ioc:Adonis/Core/Route'

Route.get('/events', async () => {
  return events()
})

export const events = () => {
  return {
    name: '',
    description: '',
    coords: {},
    owner: {},
  }
}
