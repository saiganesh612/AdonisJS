import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreatePostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }),
    content: schema.string({ trim: true }),
    coverImage: schema.file.optional({ extnames: ['jpeg', 'jpg', 'png'], size: '2mb' }),
  })

  public messages: CustomMessages = {}
}
