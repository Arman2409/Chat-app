import { FileType } from "../../../types/graphqlTypes";
import { FilesService } from "./files.service";
export declare class FilesResolver {
    private readonly service;
    constructor(service: FilesService);
    uploadFile(base: string, name: string, type: string): Promise<any>;
    getFile(name: string): Promise<FileType>;
}
