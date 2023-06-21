import { Resolver, Args, Query } from "@nestjs/graphql"

import { FileType, UploadType } from "../../../types/graphqlTypes";
import { FilesService } from "./files.service";

@Resolver()
export class FilesResolver {
   constructor(private readonly service: FilesService) { };

   @Query(() => UploadType, { name: "UploadFile" })
   async uploadFile(
      @Args("base") base: string,
      @Args("name") name: string,
      @Args("type") type: string): Promise<any> {
        return this.service.uploadFile(base, name, type );
   }

   @Query(() => FileType, { name: "GetFile" })
   async getFile(
      @Args("name") name: string): Promise<FileType> {
        return this.service.getFile(name);
   }
}