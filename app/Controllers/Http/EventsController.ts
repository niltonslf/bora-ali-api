import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'

import Event from 'App/Models/Event'
import { uuid } from 'uuidv4'

export default class EventsController {
  public async findAll({ response }: HttpContextContract) {
    let events = await Event.query().preload('images')

    response.status(200)
    return events
  }

  public async findById({ params, response }: HttpContextContract) {
    try {
      let event = await Event.findBy('id', params.id)
      await event?.load('images')

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

    response.status(200)
    return event
  }
}
