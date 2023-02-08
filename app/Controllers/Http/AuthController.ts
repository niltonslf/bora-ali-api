import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async auth({ request, response }: HttpContextContract) {
    const body = request.body()

    try {
      const user = await User.findBy('uuid', body.uuid)

      if (user) {
        const account = { ...user?.toObject(), accessToken: body.accessToken }
        return response.status(200).send(account)
      }

      const newUser = await User.create({
        email: body.email,
        name: body.name,
        profilePicture: body.profilePicture,
        uuid: body.uuid,
      })

      const account = { ...newUser?.toObject(), accessToken: body.accessToken }
      return response.status(200).send(account)
    } catch (error) {
      return response.status(500)
    }
  }
}
