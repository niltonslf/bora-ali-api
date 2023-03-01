import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { v4 as uuid } from 'uuid'

import { S3 } from '@aws-sdk/client-s3'

import fs from 'fs'

import axios from 'axios'

export default class ImageUploaderController {
  public static initAwsS3() {
    const s3Client = new S3({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_KEY as string,
        secretAccessKey: process.env.S3_SECRET as string,
      },
    })

    return s3Client
  }

  /**
   * UploadImage
   */
  public static async UploadImages(files: MultipartFileContract[]): Promise<string[]> {
    const images = files.map(async (file) => {
      const imageName = `${uuid()}.${file.extname}`
      const fileBuffer = fs.readFileSync(file.tmpPath as string)

      await this.initAwsS3().putObject({
        Bucket: process.env.S3_BUCKET,
        Body: fileBuffer,
        Key: imageName,
        ACL: 'public-read',
      })

      return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${imageName}`
    })

    return await Promise.all(images)
  }

  public static async DownloadFromSource(filesUrl: string[]): Promise<string[]> {
    const images = filesUrl.map(async (fileUrl) => {
      const imageName = `${uuid()}.jpg`

      try {
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' })
        const buffer = Buffer.from(response.data)

        await this.initAwsS3().putObject({
          Bucket: process.env.S3_BUCKET,
          Body: buffer,
          Key: imageName,
          ACL: 'public-read',
        })
      } catch (error) {
        console.log({ error })
      }

      return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${imageName}`
    })

    return await (await Promise.all(images)).filter((image) => image !== '')
  }
}
