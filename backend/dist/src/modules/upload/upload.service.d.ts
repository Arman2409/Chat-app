import { PrismaService } from 'nestjs-prisma';
import { FileType } from '../../../types/graphqlTypes';
export declare class UploadService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    uploadFile(base: string, name: string, type: string): Promise<any>;
    getFile(name: string): Promise<FileType>;
    uploadAudio(base: string): Promise<any>;
    getAudio(id: string): Promise<any>;
}
