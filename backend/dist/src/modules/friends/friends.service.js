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
exports.FriendsService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
const graphql_1 = require("graphql");
const jwt_service_1 = require("../../middlewares/jwt/jwt.service");
let FriendsService = class FriendsService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    ;
    async addFriend(ctx, id) {
        const req = ctx.req;
        const currentUser = req.session.user;
        if (!currentUser) {
            throw new graphql_1.GraphQLError("Not Signed In");
        }
        const requestingUser = await this.prisma.users.findUnique({
            where: {
                id: id
            },
        });
        if (!requestingUser) {
            throw new graphql_1.GraphQLError("Friend Request Not Send, Error Occurred");
        }
        ;
        const newRequests = requestingUser === null || requestingUser === void 0 ? void 0 : requestingUser.friendRequests;
        const sentRequests = currentUser === null || currentUser === void 0 ? void 0 : currentUser.sentRequests;
        if (newRequests.includes(currentUser.id) || sentRequests.includes(id)) {
            throw new graphql_1.GraphQLError("Already Sent");
        }
        if (id === currentUser.id) {
            throw new graphql_1.GraphQLError("Can't Send Request To Yourself");
        }
        sentRequests.unshift(id);
        newRequests.unshift(currentUser.id);
        const updateCurrent = await this.prisma.users.update({
            where: {
                id: String(currentUser.id)
            },
            data: {
                sentRequests
            }
        });
        req.session.user = Object.assign(Object.assign({}, currentUser), { sentRequests });
        const update = await this.prisma.users.update({
            where: {
                id: id
            },
            data: {
                friendRequests: newRequests
            }
        });
        if (update && updateCurrent) {
            return updateCurrent;
        }
        else {
            throw { message: "Not Sent, Error Occured" };
        }
    }
    async removeFriend(ctx, id) {
        const req = ctx.req;
        const currentUser = req.session.user;
        if (!currentUser) {
            throw new graphql_1.GraphQLError("Not Signed In");
        }
        const index = currentUser.friends.indexOf(id);
        currentUser.friends.splice(index, 1);
        const updating = await this.prisma.users.update({
            where: {
                id: currentUser.id
            },
            data: {
                friends: currentUser.friends
            }
        });
        if (!updating) {
            throw new graphql_1.GraphQLError("Error Occured");
        }
        req.session.user = currentUser;
        const friend = await this.prisma.users.findUnique({
            where: {
                id
            }
        });
        const friendIndex = friend.friends.indexOf(currentUser.id);
        friend.friends.splice(friendIndex, 1);
        const updatingFriend = await this.prisma.users.update({
            where: {
                id
            },
            data: {
                friends: friend.friends
            }
        });
        if (updatingFriend) {
            return { token: this.jwt.sign(currentUser) };
        }
        else {
            return { message: "Not Removed, Error Occured" };
        }
    }
    async findRequestUsers(ctx) {
        var _a, _b;
        const req = ctx.req;
        return await this.prisma.users.findMany({
            where: {
                id: { in: (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.friendRequests }
            }
        });
    }
    ;
    async confirmFriend(ctx, id) {
        var _a;
        const req = ctx.req;
        const currentUser = req.session.user;
        if (!currentUser) {
            throw new graphql_1.GraphQLError("Not Signed In");
        }
        currentUser.friends.push(id);
        const index = currentUser.friendRequests.indexOf(id);
        currentUser.friendRequests.splice(index, 1);
        const updating = await this.prisma.users.update({
            where: {
                id: currentUser.id
            },
            data: {
                friendRequests: currentUser.friendRequests,
                friends: currentUser.friends
            }
        });
        if (!updating) {
            throw new graphql_1.GraphQLError("Error Occured");
        }
        req.session.user = currentUser;
        const friend = await this.prisma.users.findUnique({
            where: {
                id
            }
        });
        friend.friends.push(currentUser.id);
        delete friend.sentRequests[(_a = friend.sentRequests) === null || _a === void 0 ? void 0 : _a.indexOf(currentUser.id)];
        delete friend.id;
        const updatingFriend = await this.prisma.users.update({
            where: {
                id
            },
            data: friend
        });
        if (updatingFriend) {
            return { token: this.jwt.sign(currentUser) };
        }
        else {
            return { message: "Not Confirmed, Error Occured" };
        }
    }
};
FriendsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService,
        jwt_service_1.JwtService])
], FriendsService);
exports.FriendsService = FriendsService;
//# sourceMappingURL=friends.service.js.map