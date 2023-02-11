import Application from '@ioc:Adonis/Core/Application'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'

import Event from 'App/Models/Event'
import Image from 'App/Models/Image'
import MusicStyle from 'App/Models/MusicStyle'
import PlaceType from 'App/Models/PlaceType'
import User from 'App/Models/User'
import { uuid } from 'uuidv4'

export default class EventsController {
  public async findByLocation({ request, response }: HttpContextContract) {
    const { lat, lng, radius } = request.qs()

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

    const currentAndFutureEvents = await Promise.all(resCurrentAndFuture)
    const repeatEvents = await Promise.all(resRepeat)

    response.status(200)
    return [...currentAndFutureEvents, ...repeatEvents]
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
    }
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

    const event = await Event.create({
      ...body,
      hasMeal: Boolean(body.has_meal),
      endDate: body.endDate === 'null' ? null : body.endDate,
    })

    await event.related('categories').attach(categories)

    const files = request.files('images', { size: '50mb' })

    if (files) {
      const images = files.map(async (file) => {
        const imageName = `${uuid()}.${file.extname}`
        await file.move(Application.tmpPath('uploads'), { name: imageName })
        return `/uploads/${imageName}`
      })

      const imageRes = await Promise.all(images)

      const imageBody = imageRes.map((image) => ({
        image: image,
        eventId: event.id,
      }))

      await Image.createMany(imageBody as any)
    }

    if (imagesUrl) {
      const googleImages = imagesUrl.map((image) => ({
        image: image,
        eventId: event.id,
      }))

      await Image.createMany(googleImages as any)
    }

    response.status(200)
    return event
  }
}
