import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
})

export class ImageUpload {
  static async upload(file: File) {
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const type = file.type.split('/').at(1)

    const resp = await cloudinary.uploader.upload(
      `data:image/${type};base64,${base64}`
    )

    return resp.secure_url
  }

  static async delete(url: string) {
    const file = url.split('/').at(-1)
    const name = file?.split('.').at(0) ?? ''
    const resp = await cloudinary.uploader.destroy(name)
    return resp
  }
}
