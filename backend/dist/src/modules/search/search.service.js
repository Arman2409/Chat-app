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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
const functions_1 = require("../../functions/functions");
let SearchService = class SearchService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchInAll(ctx, name, page, perPage) {
        var _a, _b, _c;
        let data;
        if (!name) {
            data = await this.prisma.users.findMany();
        }
        else {
            data = await this.prisma.users.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: name
                            }
                        },
                        {
                            name: {
                                contains: (0, functions_1.capitalizeFirstLetter)(name)
                            }
                        },
                        {
                            name: {
                                contains: name.toUpperCase()
                            }
                        },
                        {
                            name: {
                                contains: name.toLowerCase()
                            }
                        },
                    ]
                }
            });
        }
        const req = ctx.req;
        if ((_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.user) {
            if ((_c = (_b = req === null || req === void 0 ? void 0 : req.session) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.friends) {
                data = data.filter((el) => {
                    if (req.session.user.friends.includes(el.id) || el.id == req.session.user.id) {
                        return false;
                    }
                    return true;
                });
            }
        }
        ;
        const total = data.length;
        const { startIndex, endIndex } = (0, functions_1.getStartEnd)(page, perPage);
        data = (0, functions_1.sortByActivesFirst)(data);
        data = data.slice(startIndex, endIndex);
        return { users: data, total };
    }
    async searchInFriends(ctx, name, page, perPage) {
        const req = ctx.req;
        if (req.session.user) {
            if (req.session.user.friends && req.session.user.friends.length) {
                const friendsArray = req.session.user.friends;
                let friends;
                if (!name) {
                    friends = await this.prisma.users.findMany({
                        where: {
                            id: { in: friendsArray }
                        }
                    });
                }
                else if (name) {
                    friends = await this.prisma.users.findMany({
                        where: {
                            AND: [
                                { id: { in: friendsArray } },
                                {
                                    OR: [
                                        {
                                            name: {
                                                contains: name
                                            }
                                        },
                                        {
                                            name: {
                                                contains: (0, functions_1.capitalizeFirstLetter)(name)
                                            }
                                        },
                                        {
                                            name: {
                                                contains: name.toUpperCase()
                                            }
                                        },
                                        {
                                            name: {
                                                contains: name.toLowerCase()
                                            }
                                        },
                                    ]
                                }
                            ]
                        }
                    });
                }
                const total = friends.length;
                const { startIndex, endIndex } = (0, functions_1.getStartEnd)(page, perPage);
                friends = (0, functions_1.sortByActivesFirst)(friends);
                friends = friends.splice(startIndex, endIndex);
                return { users: friends, total: total };
            }
            else {
                return { users: [], total: 1 };
            }
        }
        else {
            return { message: "Not Signed In" };
        }
        ;
    }
    async findUserById(id) {
        return this.prisma.users.findUnique({
            where: { id }
        });
    }
};
SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService])
], SearchService);
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map