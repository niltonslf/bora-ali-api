import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'

import Event from 'App/Models/Event'
import Image from 'App/Models/Image'
import MusicStyle from 'App/Models/MusicStyle'
import PlaceType from 'App/Models/PlaceType'
import User from 'App/Models/User'
import ImageUploaderController from './ImageUploadersController'

export default class EventsController {
  public async findByLocation({ request, response }: HttpContextContract) {
    const { lat, lng, radius, category, placeType, musicStyle } = request.qs()

    const currentAndFutureEventsQuery = await Database.rawQuery(
      `
        SELECT *, ST_Distance_Sphere(point (:lng, :lat), point(lng, lat)) * 0.001 as distance_in_kms,
        LOCATE(LOWER(DATE_FORMAT(CURDATE(), '%W')),repeat_days) as matchIndex
        FROM events
        WHERE repeat_days is null
        and ( DATE(start_date) >= CURDATE() or (DATE(start_date) <= CURDATE() and DATE(end_date) >= CURDATE() or end_date is null))
        HAVING distance_in_kms <= :radius
        ORDER BY distance_in_kms asc
`,
      { lng, lat, radius }
    )

    const repeatEventsQuery = await Database.rawQuery(
      `
        SELECT *, ST_Distance_Sphere(point (:lng, :lat), point(lng, lat)) * 0.001 as distance_in_kms,
        LOCATE(LOWER(DATE_FORMAT(CURDATE(), '%W')),repeat_days) as matchIndex
        FROM events
        where repeat_days is not null
        and DATE(start_date) <= CURDATE() and (DATE(end_date) >= CURDATE() or end_date is null)
        HAVING (distance_in_kms <= :radius and matchIndex > 0)
        ORDER BY distance_in_kms asc;
`,
      { lng, lat, radius }
    )

    const resCurrentAndFuture = this.fetchEventsDependencies(currentAndFutureEventsQuery[0])
    const resRepeat = this.fetchEventsDependencies(repeatEventsQuery[0])

    let currentAndFutureEvents = await Promise.all(resCurrentAndFuture)
    let repeatEvents = await Promise.all(resRepeat)

    if (category) {
      currentAndFutureEvents = currentAndFutureEvents.filter((event) => {
        const res = event.categories.find((cat) => cat.name === category)
        if (res) return event
        return null
      })

      repeatEvents = repeatEvents.filter((event) => {
        const res = event.categories.find((cat) => cat.name === category)
        if (res) return event
        return null
      })
    }

    if (placeType) {
      currentAndFutureEvents = currentAndFutureEvents.filter((event) => {
        const res = event.placeType.name === placeType
        if (res) return event
        return null
      })

      repeatEvents = repeatEvents.filter((event) => {
        const res = event.placeType.name === placeType
        if (res) return event
        return null
      })
    }

    if (musicStyle) {
      currentAndFutureEvents = currentAndFutureEvents.filter((event) => {
        const res = event.musicStyle.name === musicStyle
        if (res) return event
        return null
      })

      repeatEvents = repeatEvents.filter((event) => {
        const res = event.musicStyle.name === musicStyle
        if (res) return event
        return null
      })
    }

    response.status(200)
    return [...currentAndFutureEvents, ...repeatEvents]
  }

  public async findAll({ request, response }: HttpContextContract) {
    const params = request.qs()

    let eventsQuery = Event.query()

    if (params.userId) {
      eventsQuery.where('user_id', params.userId)
    }

    eventsQuery
      .preload('images')
      .preload('categories')
      .preload('musicStyle')
      .preload('placeType')
      .preload('user')

    const events = await eventsQuery

    response.status(200)
    return events
  }

  public async findById({ params, response }: HttpContextContract) {
    try {
      let event = await Event.findBy('id', params.id)
      await event?.load('categories')
      await event?.load('user')
      await event?.load('images')
      await event?.load('musicStyle')
      await event?.load('placeType')

      if (event) {
        response.status(200)
        return event
      }

      response.status(404)
    } catch (error) {
      response.status(500)
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const categories = body.categories?.split(',')
    const imagesUrl = body.imagesUrl?.split(',') || []

    delete body.imagesUrl

    const event = await Event.create(this.normalizeBody(body))
    await event.related('categories').attach(categories)

    const files = request.files('images', { size: '50mb' })
    if (files) this.uploadEventImages(files, event)

    if (imagesUrl) {
      const imageRes = await ImageUploaderController.DownloadFromSource(imagesUrl)

      if (!imageRes.length) return

      const imageBody = imageRes.map((image) => ({ image, eventId: event.id }))

      await Image.query().where('event_id', event.id).delete()
      await Image.createMany(imageBody as any)
    }

    response.status(200)
    return event
  }

  public async update({ request, response }: HttpContextContract) {
    const body = request.body()

    const categories = body.categories?.split(',')
    const imagesUrl = body.imagesUrl?.split(',') || []

    const eventId = body.id
    delete body.imagesUrl
    delete body.id

    const event = await Event.updateOrCreate({ id: eventId }, this.normalizeBody(body))

    categories.forEach(async (category) => {
      const resCategory = await event
        .related('categories')
        .query()
        .where('category_id', category)
        .andWhere('event_id', eventId)
        .first()

      if (!resCategory) await event.related('categories').attach([category])
    })

    // delete all images
    if (imagesUrl.length === 0) await Image.query().where('event_id', event.id).delete()

    // upload new images
    const files = request.files('images', { size: '50mb' })
    if (files) this.uploadEventImages(files, event)

    response.status(200)
    return event
  }

  public async delete({ request, response }: HttpContextContract) {
    const params = request.params()

    const res = await Event.query().where('id', params.eventId).delete()

    response.status(200)
    return res
  }

  private async uploadEventImages(files: MultipartFileContract[], event: Event) {
    const imageRes = await ImageUploaderController.UploadImages(files)
    const imageBody = imageRes.map((image) => ({ image, eventId: event.id }))
    await Image.createMany(imageBody as any)
  }

  private normalizeBody(body) {
    return {
      ...body,
      hasMeal: Boolean(body.has_meal),
      endDate: body.endDate === 'null' ? null : body.endDate,
      repeatDays: body.repeatDays === 'null' ? null : body.repeatDays,
      isPrivate: body.isPrivate === 'true',
    }
  }

  private fetchEventsDependencies(events) {
    return events.map(async (event) => {
      const images = await Image.query().where('eventId', '=', event.id)
      const categories = await Category.query()
        .join('category_event', 'categories.id', 'category_event.category_id')
        .where('category_event.event_id', '=', event.id)

      const musicStyle = await MusicStyle.query().where('id', '=', event.music_style_id).first()
      const placeType = await PlaceType.query().where('id', '=', event.place_type_id).first()
      const user = await User.query().where('id', '=', event.user_id).first()

      Object.assign(event, { images, categories, musicStyle, placeType, user })

      return this.parseData(event)
    })
  }

  private parseData(event) {
    return {
      ...event,
      id: event.id,
      createdAt: event.created_at,
      updatedAt: event.updated_at,
      hasMeal: event.has_meal,
      startDate: event.start_date,
      endDate: event.end_date,
      endTime: event.end_time,
      startTime: event.start_time,
    }
  }
}
