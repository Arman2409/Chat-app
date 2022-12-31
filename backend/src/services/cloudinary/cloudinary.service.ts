import { Injectable } from '@nestjs/common';
import * as cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

@Injectable()
export class CloudinaryService {
    async upload(base64:string, public_id?:string):Promise<any> {
      return await cloudinary.v2.uploader.upload(base64)
   }
}
