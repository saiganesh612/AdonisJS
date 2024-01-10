import Route from '@ioc:Adonis/Core/Route'

export default function postRoutes() {
  Route.resource('posts', 'PostsController')
    .apiOnly()
    .as('posts')
    .middleware({ '*': 'auth' })
    .where('id', Route.matchers.uuid())
}
