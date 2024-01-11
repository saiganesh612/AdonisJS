import Route from '@ioc:Adonis/Core/Route'

export default function userRoutes() {
  Route.group(() => {
    Route.get('/', 'UserController.index').as('get.user')
    Route.put('/', 'UserController.update').as('update.user')
  })
    .prefix('user')
    .middleware('auth')
}
