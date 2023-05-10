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
        let data;
        if (!name) {
            data = await this.prisma.users.findMany();
        }
        else {
            data = await this.prisma.users.findMany({
                where: {
                    name: {
                        contains: name
                    }
                }
            });
        }
        const req = ctx.req;
        if (req.session.user) {
            if (req.session.user.friends) {
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
        const { startIndex, endIndex } = (0, functions_1.getStartEnd)(page, perPage, data.length);
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
                                    name: {
                                        contains: name
                                    }
                                }
                            ]
                        }
                    });
                }
                const total = friends.length;
                const { startIndex, endIndex } = (0, functions_1.getStartEnd)(page, perPage, friends.length);
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