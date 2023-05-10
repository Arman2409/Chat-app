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
exports.SearchResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphqlTypes_1 = require("../../../types/graphqlTypes");
const search_service_1 = require("./search.service");
let SearchResolver = class SearchResolver {
    constructor(search) {
        this.search = search;
    }
    async searchInAll(ctx, name, page, perPage) {
        return await this.search.searchInAll(ctx, name, page, perPage);
    }
    async searchInFriends(ctx, name, page, perPage) {
        return await this.search.searchInFriends(ctx, name, page, perPage);
    }
    async findUser(id) {
        return await this.search.findUserById(id);
    }
};
__decorate([
    (0, graphql_1.Query)(() => graphqlTypes_1.SearchType, { name: "SearchInAll" }),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)("name")),
    __param(2, (0, graphql_1.Args)("page")),
    __param(3, (0, graphql_1.Args)("perPage")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number]),
    __metadata("design:returntype", Promise)
], SearchResolver.prototype, "searchInAll", null);
__decorate([
    (0, graphql_1.Query)(() => graphqlTypes_1.SearchType, { name: "SearchInFriends" }),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)("name")),
    __param(2, (0, graphql_1.Args)("page")),
    __param(3, (0, graphql_1.Args)("perPage")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number]),
    __metadata("design:returntype", Promise)
], SearchResolver.prototype, "searchInFriends", null);
__decorate([
    (0, graphql_1.Query)(() => graphqlTypes_1.UserType, { name: "FindUserById" }),
    __param(0, (0, graphql_1.Args)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SearchResolver.prototype, "findUser", null);
SearchResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchResolver);
exports.SearchResolver = SearchResolver;
//# sourceMappingURL=search.resolver.js.map