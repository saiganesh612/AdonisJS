import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const userSchema = schema.create({
      username: schema.string({ trim: true }),
      email: schema.string([rules.trim(), rules.email()]),
      password: schema.string([rules.minLength(8)]),
    })

    const data = await request.validate({ schema: userSchema })
    const user = await User.findBy('email', data.email)
    if (!user) {
      const newUser = await User.create(data)
      response.status(201)
      return { message: 'User created!', user: newUser }
    }
    response.status(403).json({ message: 'User with given email id already existed' })
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const token = await auth.use('api').attempt(email, password, {
        // expiresIn: '5 mins',
        // name: 'API Authentication',
      })
      response.status(200).json({ message: 'Login Success', token })
    } catch (err) {
      console.log(err)
      return response.unauthorized('Invalid Credentials')
    }
  }

  public async logout({ auth }: HttpContextContract) {
    console.log('user: ', auth.user)
    // auth.logout()
    auth.use('api').revoke()
    return { message: 'User logged out.' }
  }
}
