import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MusicStyle from 'App/Models/MusicStyle'

export default class MusicStylesController {
  public async findAll({ response }: HttpContextContract) {
    let musicStyles = await MusicStyle.all()

    response.status(200)
    return musicStyles
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const musicStyle = await MusicStyle.create(body)

    response.status(200)
    return musicStyle
  }
}
