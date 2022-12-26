import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  HasMany,
  hasMany,
  hasOne,
  HasOne,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Image from './Image'
import Category from './Category'
import User from './User'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: string

  @column()
  public description: string

  @hasMany(() => Image)
  public images: HasMany<typeof Image>

  @hasOne(() => User)
  public userId: HasOne<typeof User>

  @column()
  public lat: number

  @column()
  public lng: number

  @column()
  public address: string

  @column()
  public price: string

  @column()
  public hasMeal: boolean

  @column()
  public musicStyle: string

  @manyToMany(() => Category)
  public categories: ManyToMany<typeof Category>

  @column()
  public placeType: string

  @column()
  public startDate: Date

  @column()
  public endDate: Date
}
