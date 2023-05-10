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
exports.SocketsService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
let SocketsService = class SocketsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateUserStatus(id, status, lastVisited) {
        if (lastVisited) {
            return await this.prisma.users.update({
                where: { id },
                data: {
                    active: status,
                    lastVisited: new Date().toString().slice(0, 10)
                }
            });
        }
        return await this.prisma.users.update({
            where: { id },
            data: {
                active: status,
            }
        });
    }
    async updateMessages(allMessages) {
        await this.prisma.messages.deleteMany();
        if (allMessages.length) {
            await this.prisma.messages.createMany({ data: allMessages });
        }
        ;
    }
};
SocketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService])
], SocketsService);
exports.SocketsService = SocketsService;
//# sourceMappingURL=sockets.service.js.map