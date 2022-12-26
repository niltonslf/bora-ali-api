import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { CamelCaseNamingStrategy } from './CamelCaseNamingStrategy'

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
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
