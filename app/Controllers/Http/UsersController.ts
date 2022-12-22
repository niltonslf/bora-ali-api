import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

export default class UsersController {
  public async create({ request, response }: HttpContextContract) {
    const body = request.body()

    if (!body) {
      response.status(400)
      return { response: 'Erro ao resgatar os dados da request' }
    }

    const userExist = await this.getByUuid(body.uuid)

    if (userExist) {
      response.status(200)
      return userExist
    }

    const user = await User.create({ ...body })

    response.status(200)

    return user
  }

  public async getById({ params, response }: HttpContextContract) {
    try {
      const user = await User.findByOrFail('id', params.id)

      response.status(200)

      return user
    } catch (error) {
      response.status(500)
      return { response: error }
    }
  }

  private async getByUuid(uuid) {
    try {
      return await User.findByOrFail('uuid', uuid)
    } catch (error) {
      return { response: error }
    }
  }
}
