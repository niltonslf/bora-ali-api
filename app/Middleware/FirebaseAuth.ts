import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import * as admin from 'firebase-admin'

export default class FirebaseAuth {
  constructor() {}

  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const { authorization } = request.headers()

    if (!authorization) return response.status(401).send({ message: 'Unauthorized' })

    if (!authorization.startsWith('Bearer'))
      return response.status(401).send({ message: 'Unauthorized' })

    const split = authorization.split('Bearer ')
    if (split.length !== 2)
      return response.status(401).send({
        message: 'Unauthorized',
      })
    try {
      const token = split[1]

      const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token)

      const user = await User.query().where('uuid', decodedToken.uid).first()

      if (!user) throw Error('user not found')

      await next()
    } catch (err) {
      return response.status(500).send({ code: err.code, message: err.message })
    }
  }
}
