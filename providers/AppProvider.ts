import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { CamelCaseNamingStrategy } from './CamelCaseNamingStrategy'

import * as admin from 'firebase-admin'

import serviceAccount from '../firebase-admin.json'

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
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as any),
    })
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
