import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'

export default class CategoriesController {
  public async findAll({ response }: HttpContextContract) {
    let categories = await Category.all()

    response.status(200)
    return categories
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const category = await Category.create(body)

    response.status(200)
    return category
  }
}
