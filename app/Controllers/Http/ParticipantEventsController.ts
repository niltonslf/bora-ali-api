import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from 'App/Models/Event'

export default class ParticipantEventsController {
  public async confirmPresence({ request, response }: HttpContextContract) {
    const body = request.body()
    const params = request.params()

    const userId = body.userId
    const eventId = params.eventId

    const event = await Event.query().where('id', eventId).first()

    try {
      await event?.related('participants').attach([userId])
    } catch (error) {
      response.status(500)
      return error
    }

    response.status(200)
  }
  public async cancelPresence({ request, response }: HttpContextContract) {
    const body = request.body()
    const params = request.params()

    const userId = body.userId
    const eventId = params.eventId

    const event = await Event.query().where('id', eventId).first()

    try {
      await event?.related('participants').detach([userId])
    } catch (error) {
      response.status(500)
      return error
    }

    response.status(200)
    return 'success'
  }
}
