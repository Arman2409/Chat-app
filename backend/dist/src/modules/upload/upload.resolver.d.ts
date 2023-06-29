import { FileType } from "../../../types/graphqlTypes";
import { UploadService } from "./upload.service";
export declare class UploadResolver {
    private readonly service;
    constructor(service: UploadService);
    uploadFile(base: string, name: string, type: string): Promise<any>;
    getFile(name: string): Promise<FileType>;
    uploadAudio(base: string): Promise<any>;
    getAudio(id: string): Promise<any>;
}
