"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
let UploadService = class UploadService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async uploadFile(base, name, type) {
        const fileExists = await this.prisma.files.findFirst({ where: {
                name
            } });
        const originalName = name;
        if (fileExists) {
            const fileType = name.slice(name.indexOf("."), name.length);
            let fileName = name.slice(0, name.indexOf("."));
            name = fileName + "_" + Math.random().toString(36).substring(0, 1) + fileType;
        }
        const newFile = await this.prisma.files.create({
            data: {
                name,
                originalName,
                contentType: type,
                data: base,
            }
        });
        return { name: newFile.name, originalName: newFile.originalName };
    }
    async getFile(name) {
        const resp = await this.prisma.files.findFirst({
            where: {
                name
            }
        });
        return resp;
    }
    async uploadAudio(base) {
        const resp = await this.prisma.audioFiles.create({
            data: {
                data: base
            }
        });
        return { id: resp.id };
    }
    async getAudio(id) {
        const resp = await this.prisma.audioFiles.findFirst({
            where: {
                id
            }
        });
        return resp;
    }
};
UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService])
], UploadService);
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map