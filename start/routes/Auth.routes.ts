import Route from '@ioc:Adonis/Core/Route'

export default function authenticationRoutes() {
  Route.group(() => {
    Route.post('/register', 'AuthController.register').as('auth.register')
    Route.post('/login', 'AuthController.login').as('auth.login')
    Route.get('/logout', 'AuthController.logout').as('auth.logout').middleware('auth')
    Route.get('/get-profile', 'AuthController.getProfile').as('get_profile').middleware('auth')
  }).prefix('auth')
}
