import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Image from 'App/Models/Image'
import { uuid } from 'uuidv4'

export default class ImagesController {
  public async findAll({ response }: HttpContextContract) {
    let images = await Image.all()

    response.status(200)
    return images
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const file = request.file('image', { size: '10mb' })

    if (file) {
      const imageName = `${uuid()}.${file.extname}`
      await file.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      Object.assign(body, { image: `/uploads/${imageName}` })
    }

    const image = await Image.create(body)

    response.status(200)
    return image
  }
}
