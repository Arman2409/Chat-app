import { PrismaService } from 'nestjs-prisma';
import { FileType } from '../../../types/graphqlTypes';
export declare class FilesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    uploadFile(base: string, name: string, type: string): Promise<any>;
    getFile(name: string): Promise<FileType>;
}
