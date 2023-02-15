import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { v4 as uuid } from 'uuid'
import Downloader from 'image-downloader'
import Application from '@ioc:Adonis/Core/Application'
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

  public static async DownloadFromSource(files: string[]): Promise<string[]> {
    const images = files.map(async (file) => {
      const imageName = `${uuid()}.jpg`
      Downloader.image({ url: file, dest: `${Application.tmpPath('uploads')}/${imageName}` })
      return imageName
    })

    return await Promise.all(images)
  }
}
