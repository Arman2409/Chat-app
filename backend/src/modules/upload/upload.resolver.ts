import { Resolver, Args, Query } from "@nestjs/graphql"

import { FileType, UploadFileType, UploadType } from "../../../types/graphqlTypes";
import { UploadService } from "./upload.service";

@Resolver()
export class UploadResolver {
   constructor(private readonly service: UploadService) { };

   @Query(() => UploadType, { name: "UploadFile" })
   async uploadFile(
      @Args("base") base: string,
      @Args("name") name: string,
      @Args("type") type: string): Promise<any> {
        return this.service.uploadFile(base, name, type );
   }

   @Query(() => UploadFileType, { name: "GetFile" })
   async getFile(
      @Args("name") name: string): Promise<FileType> {
        return this.service.getFile(name);
   }

   @Query(() => UploadFileType, { name: "UploadAudio" })
   async uploadAudio(
      @Args("base") base: string): Promise<any> {
        return this.service.uploadAudio(base);
   }

   @Query(() => UploadFileType, { name: "GetAudio" })
   async getAudio(
      @Args("audioId") id: string): Promise<any> {
        return this.service.getAudio(id);
   }
}