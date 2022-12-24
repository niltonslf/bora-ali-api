import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/user', 'UsersController.create')

  Route.group(() => {
    Route.get('/event', 'EventsController.findAll')
    Route.get('/event/:id', 'EventsController.findById')
    Route.post('/event', 'EventsController.store')

    Route.get('/user/:id', 'UsersController.getById')
  }).middleware('auth')
}).prefix('/api')
