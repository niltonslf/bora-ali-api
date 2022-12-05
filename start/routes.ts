import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/event', 'EventsController.findAll')
  Route.post('/event', 'EventsController.store')

  Route.post('/user', 'UsersController.create')
  Route.get('/user/:id', 'UsersController.getById')
}).prefix('/api')
