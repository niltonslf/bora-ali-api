import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Image from './Image'
import Category from './Category'
import PlaceType from './PlaceType'
import MusicStyle from './MusicStyle'
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

  @manyToMany(() => Category)
  public categories: ManyToMany<typeof Category>

  @hasMany(() => Image)
  public images: HasMany<typeof Image>

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public musicStyleId: number

  @belongsTo(() => MusicStyle)
  public musicStyle: BelongsTo<typeof MusicStyle>

  @column()
  public placeTypeId: number

  @belongsTo(() => PlaceType)
  public placeType: BelongsTo<typeof PlaceType>

  @column()
  public startDate: Date

  @column()
  public endDate: Date

  @column()
  public startTime: string

  @column()
  public endTime: string

  @column()
  public repeatDays: string

  @column()
  public isPrivate: boolean

  @manyToMany(() => User)
  public participants: ManyToMany<typeof User>
}
