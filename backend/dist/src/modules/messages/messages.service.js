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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
const functions_1 = require("../../functions/functions");
let MessagesService = class MessagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async lastMessages(ctx, page, perPage) {
        const req = ctx.req;
        const currentUser = req.session.user;
        let messages = await this.prisma.messages.findMany({
            where: {
                between: {
                    has: currentUser.id
                }
            }
        });
        const length = messages.length;
        const { startIndex, endIndex } = (0, functions_1.getStartEnd)(page, perPage, length);
        messages = messages.slice(startIndex, endIndex);
        const resp = { total: length, users: messages.map(async (message) => {
                var _a, _b, _c, _d;
                const lastMessage = message === null || message === void 0 ? void 0 : message.messages[((_a = message === null || message === void 0 ? void 0 : message.messages) === null || _a === void 0 ? void 0 : _a.length) - 1];
                const notSeenCount = (message.notSeen.by === ((_b = message === null || message === void 0 ? void 0 : message.between) === null || _b === void 0 ? void 0 : _b.indexOf(currentUser.id))) ? (_c = message === null || message === void 0 ? void 0 : message.notSeen) === null || _c === void 0 ? void 0 : _c.count : 0;
                const userId = (_d = message === null || message === void 0 ? void 0 : message.between) === null || _d === void 0 ? void 0 : _d.filter((elem) => elem !== currentUser.id)[0];
                return await this.prisma.users.findUnique({
                    where: {
                        id: userId
                    }
                }).then((resp) => (Object.assign(Object.assign({}, resp), { lastMessage,
                    notSeenCount })));
            }) || []
        };
        return resp;
    }
};
MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService])
], MessagesService);
exports.MessagesService = MessagesService;
//# sourceMappingURL=messages.service.js.map