import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Post from 'App/Models/Post'
import User from 'App/Models/User'

export default class PostsController {
  public async index({ auth }: HttpContextContract) {
    const authUser = auth.use('api').user!.serializeAttributes()
    const user = await User.findByOrFail('email', authUser.email)
    const userPosts = (await user.related('posts').query()) || []
    return { message: 'retrived', data: { posts: userPosts, totalCount: userPosts.length } }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const newPostSchema = schema.create({
      title: schema.string({ trim: true }),
      content: schema.string({ trim: true }),
    })
    const payload = await request.validate({ schema: newPostSchema })

    const authUser = auth.use('api').user!.serializeAttributes()
    const user = await User.findByOrFail('email', authUser.email)
    const post = await user.related('posts').create(payload)
    response.status(201)
    return { message: 'New post created', post }
  }

  public async show({ params }: HttpContextContract) {
    const postId = params.id

    const post = await Post.findOrFail(postId)
    await post.load('author')
    return { message: 'Post Retrived', post }
  }

  public async update({ request, params, bouncer }: HttpContextContract) {
    const postId = params.id
    const payload = request.body()

    const post = await Post.findOrFail(postId)
    await post.load('author')

    // Checking Authorization whether currently logged have access to update the post.
    await bouncer.with('PostPolicy').authorize('update', post)

    post.$attributes = { ...post.$attributes, ...payload }
    post.save()
    return { message: 'Post Updated', post }
  }

  public async destroy({ params, bouncer }: HttpContextContract) {
    const postId = params.id

    const post = await Post.findOrFail(postId)
    await post.load('author')

    // Checking Authorization whether currently logged have access to delete the post.
    await bouncer.with('PostPolicy').authorize('delete', post)

    await post.delete()
    return { message: 'Post Deleted', post }
  }
}
