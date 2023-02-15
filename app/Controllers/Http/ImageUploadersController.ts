import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { v4 as uuid } from 'uuid'
import Downloader from 'image-downloader'
import Application from '@ioc:Adonis/Core/Application'

import Drive from '@ioc:Adonis/Core/Drive'

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

  public static async DownloadFromSource(filesUrl: string[]): Promise<string[]> {
    const images = filesUrl.map(async (fileUrl) => {
      const fileName = fileUrl?.split('/').at(-1) as string

      const fileExists = await Drive.exists(fileName)

      if (!fileExists) {
        const imageName = `${uuid()}.jpg`
        Downloader.image({ url: fileUrl, dest: `${Application.tmpPath('uploads')}/${imageName}` })

        return imageName
      }
      return ''
    })

    return await (await Promise.all(images)).filter((image) => image !== '')
  }
}
