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
exports.FriendsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphqlTypes_1 = require("../../../types/graphqlTypes");
const friends_service_1 = require("./friends.service");
let FriendsResolver = class FriendsResolver {
    constructor(service) {
        this.service = service;
    }
    async addFriend(ctx, id) {
        return await this.service.addFriend(ctx, id);
    }
    async removeFriend(ctx, id) {
        return await this.service.removeFriend(ctx, id);
    }
    async getRequests(ctx, arr) {
        return await this.service.findRequestUsers(ctx);
    }
    async confirmFriend(ctx, id) {
        return this.service.confirmFriend(ctx, id);
    }
};
__decorate([
    (0, graphql_1.Query)(() => graphqlTypes_1.UserType, { name: 'AddFriend' }),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FriendsResolver.prototype, "addFriend", null);
__decorate([
    (0, graphql_1.Query)(() => graphqlTypes_1.TokenType, { name: 'RemoveFriend' }),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)('friendId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FriendsResolver.prototype, "removeFriend", null);
__decorate([
    (0, graphql_1.Query)(() => [graphqlTypes_1.UserType], { name: 'GetFriendRequestsUsers' }),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)('ids', { type: () => [String] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], FriendsResolver.prototype, "getRequests", null);
__decorate([
    (0, graphql_1.Query)(() => graphqlTypes_1.TokenType, { name: "ConfirmFriend" }),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)("friendId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FriendsResolver.prototype, "confirmFriend", null);
FriendsResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [friends_service_1.FriendsService])
], FriendsResolver);
exports.FriendsResolver = FriendsResolver;
//# sourceMappingURL=friends.resolver.js.map