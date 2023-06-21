import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { FileType } from '../../../types/graphqlTypes';

@Injectable()
export class FilesService {
    constructor(private readonly prisma:PrismaService){}

    async uploadFile(base:string, name:string, type:string):Promise<any> {
        const fileExists = await this.prisma.files.findFirst(
            { where:  
                {
                    name
                }}
        );
        const originalName = name;
        if(fileExists) {
            const fileType:string = name.slice(name.indexOf("."), name.length);
            let fileName:string = name.slice(0,name.indexOf("."));
            name = fileName + "_" + Math.random().toString(36).substring(0,1) + fileType;
        }
        const newFile = await this.prisma.files.create({
            data: {
                name,
                originalName,
                contentType: type,
                data: base,
            }
        });
        return {name: newFile.name, originalName: newFile.originalName};
    }

    async getFile(name:string):Promise<FileType> { 
        const resp = await this.prisma.files.findFirst({
          where: {
            name
          } as any
       });
       return resp;
    }
}
