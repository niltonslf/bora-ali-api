import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Event from 'App/Models/Event'
import { uuid } from 'uuidv4'

export default class EventsController {
  public async findAll({ response }: HttpContextContract) {
    let events = await Event.all()

    events = events.map((event) => {
      event.image = `/uploads/${event.image}`

      return event
    })

    response.status(200)
    return events
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const image = request.file('image', { size: '10mb' })

    if (image) {
      const imageName = `${uuid()}.${image.extname}`
      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      Object.assign(body, { image: imageName })
    }

    const event = await Event.create({ ...body })

    response.status(200)
    return event
  }
}
