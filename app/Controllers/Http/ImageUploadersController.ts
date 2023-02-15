import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { v4 as uuid } from 'uuid'

export default class ImageUploaderController {
  /**
   * UploadImage
   */
  public static async UploadImages(files: MultipartFileContract[]): Promise<string[]> {
    const images = files.map(async (file) => {
      const imageName = `${uuid()}.${file.extname}`
      await file.moveToDisk('./', { name: imageName })
      return imageName
    })

    return await Promise.all(images)
  }
}
