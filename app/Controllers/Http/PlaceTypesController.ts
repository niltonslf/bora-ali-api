import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import PlaceType from 'App/Models/PlaceType'

export default class PlaceTypesController {
  public async findAll({ response }: HttpContextContract) {
    let places = await PlaceType.all()

    response.status(200)
    return places
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const place = await PlaceType.create(body)

    response.status(200)
    return place
  }
}
