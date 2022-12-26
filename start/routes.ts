import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/user', 'UsersController.create')

  Route.get('/category', 'CategoriesController.findAll')
  Route.post('/category', 'CategoriesController.store')

  Route.get('/image', 'ImagesController.findAll')
  Route.post('/image', 'ImagesController.store')

  Route.post('/event', 'EventsController.store')
  Route.get('/event', 'EventsController.findAll')
  Route.get('/event/:id', 'EventsController.findById')

  Route.group(() => {
    Route.get('/user/:id', 'UsersController.getById')
  }).middleware('auth')
}).prefix('/api')
