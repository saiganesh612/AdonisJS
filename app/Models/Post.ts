import { BaseModel, BelongsTo, beforeCreate, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'

import User from './User'

export default class Post extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: null })
  public userId: number

  @column()
  public title: string

  @column()
  public content: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public author: BelongsTo<typeof User>

  @beforeCreate()
  public static async setId(post: Post) {
    post.id = uuidv4()
  }
}
