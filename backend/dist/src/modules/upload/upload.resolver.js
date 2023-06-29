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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphqlTypes_1 = require("../../../types/graphqlTypes");
const upload_service_1 = require("./upload.service");
let UploadResolver = class UploadResolver {
    constructor(service) {
        this.service = service;
    }
    ;
    async uploadFile(base, name, type) {
        return this.service.uploadFile(base, name, type);
    }
    async getFile(name) {
        return this.service.getFile(name);
    }
    async uploadAudio(base) {
        return this.service.uploadAudio(base);
    }
    async getAudio(id) {
        return this.service.getAudio(id);
    }
};
__decorate([
    (0, graphql_1.Query)(() => graphqlTypes_1.UploadType, { name: "UploadFile" }),
    __param(0, (0, graphql_1.Args)("base")),
    __param(1, (0, graphql_1.Args)("name")),
    __param(2, (0, graphql_1.Args)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UploadResolver.prototype, "uploadFile", null);
__decorate([
    (0, graphql_1.Query)(() => graphqlTypes_1.UploadFileType, { name: "GetFile" }),
    __param(0, (0, graphql_1.Args)("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadResolver.prototype, "getFile", null);
__decorate([
    (0, graphql_1.Query)(() => graphqlTypes_1.UploadFileType, { name: "UploadAudio" }),
    __param(0, (0, graphql_1.Args)("base")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadResolver.prototype, "uploadAudio", null);
__decorate([
    (0, graphql_1.Query)(() => graphqlTypes_1.UploadFileType, { name: "GetAudio" }),
    __param(0, (0, graphql_1.Args)("audioId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadResolver.prototype, "getAudio", null);
UploadResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadResolver);
exports.UploadResolver = UploadResolver;
//# sourceMappingURL=upload.resolver.js.map