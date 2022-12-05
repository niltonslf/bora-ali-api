import { uuid } from 'uuidv4'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Application from '@ioc:Adonis/Core/Application'

import User from 'App/Models/User'

export default class UsersController {
  public async create({ request, response }: HttpContextContract) {
    const body = request.body()

    if (!body) {
      response.status(400)
      return {
        data: { response: 'Erro ao resgatar os dados da request' },
      }
    }

    const image = request.file('profilePicture', { size: '10mb' })

    if (image) {
      const imageName = `${uuid()}.${image.extname}`
      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      Object.assign(body, { profilePicture: imageName })
    }

    const user = await User.create({ ...body })

    response.status(200)

    return {
      data: user,
    }
  }

  public async getById({ params, response }: HttpContextContract) {
    try {
      const user = await User.findByOrFail('id', params.id)

      response.status(200)

      user.profilePicture = `/uploads/${user.profilePicture}`

      return user
    } catch (error) {
      response.status(500)
      return { data: { response: error } }
    }
  }
}
