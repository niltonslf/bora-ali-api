import Application from '@ioc:Adonis/Core/Application'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Event from 'App/Models/Event'
import Image from 'App/Models/Image'
import { uuid } from 'uuidv4'

export default class EventsController {
  public async findAll({ response }: HttpContextContract) {
    let events = await Event.query()
      .preload('images')
      .preload('categories')
      .preload('musicStyle')
      .preload('placeType')
      .preload('user')

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

    const event = await Event.create(body)
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

    response.status(200)
    return event
  }
}
