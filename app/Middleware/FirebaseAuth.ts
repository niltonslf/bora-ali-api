import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { admin } from 'Config/firebase'

export default class FirebaseAuth {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const authorization = request.headers().authorization || ''
    const token = authorization.split(' ')[1]

    try {
      const data = await admin.auth().verifyIdToken(token)

      if (!data) {
        response.status(401)
        return response.json({ message: 'unauthorized' })
      }
    } catch (error) {
      response.status(401)
      return response.json({ message: 'unexpected error' })
    }

    await next()
  }
}
