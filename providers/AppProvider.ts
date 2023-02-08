import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { CamelCaseNamingStrategy } from './CamelCaseNamingStrategy'

import * as admin from 'firebase-admin'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    const { BaseModel } = await import('@ioc:Adonis/Lucid/Orm')
    BaseModel.namingStrategy = new CamelCaseNamingStrategy()
  }

  public async ready() {
    const serviceAccount = Buffer.from(
      process.env.FIREBASE_ADMIN_CONFIG_BASE64 as any,
      'base64'
    ).toString('ascii')

    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount)),
    })
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
