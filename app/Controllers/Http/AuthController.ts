import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    // Validating request data
    const { username, email, password, avatar } = await request.validate(CreateUserValidator)

    const user = await User.findBy('email', email)
    if (!user) {
      const newUser = await User.create({
        username,
        email,
        password,
        avatar: avatar ? Attachment.fromFile(avatar) : null,
      })
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
    auth.use('api').revoke()
    return { message: 'User logged out.' }
  }
}
