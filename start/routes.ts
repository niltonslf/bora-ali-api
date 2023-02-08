import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/auth', 'AuthController.auth')

  Route.post('/user', 'UsersController.create')
  Route.get('/category', 'CategoriesController.findAll')
  Route.post('/category', 'CategoriesController.store')

  Route.get('/place-type', 'PlaceTypesController.findAll')
  Route.post('/place-type', 'PlaceTypesController.store')

  Route.get('/music-style', 'MusicStylesController.findAll')
  Route.post('/music-style', 'MusicStylesController.store')

  Route.get('/image', 'ImagesController.findAll')
  Route.post('/image', 'ImagesController.store')

  Route.get('/event', 'EventsController.findAll')
  Route.get('/event/location', 'EventsController.findByLocation')
  Route.get('/event/:id', 'EventsController.findById')
  Route.post('/event', 'EventsController.store')

  Route.group(() => {
    Route.get('/user/:id', 'UsersController.getById')
  }).middleware(['firebaseAuth'])
}).prefix('/api')
