import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

export default class UserController {
  public async index({ auth }: HttpContextContract) {
    const authUser = auth.use('api').user!.serializeAttributes()

    const user = await User.findByOrFail('email', authUser.email)
    return { data: user }
  }

  public async update({ request, auth }: HttpContextContract) {
    const body = request.body()
    const avatar = request.file('avatar')

    const authUser = auth.use('api').user!.serializeAttributes()
    const user = await User.findByOrFail('email', authUser.email)

    user.merge(body)
    if (avatar) {
      user.$attributes = {
        ...user.$attributes,
        avatar: Attachment.fromFile(avatar),
      }
    }
    await user.save()
    return { message: 'User Updated!', user }
  }
}
