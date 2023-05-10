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
exports.RecoverType = exports.MessageType = exports.NotSeenType = exports.NewsType = exports.SearchType = exports.TokenType = exports.UserType = void 0;
const graphql_1 = require("@nestjs/graphql");
let UserType = class UserType {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserType.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserType.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserType.prototype, "password", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserType.prototype, "image", void 0);
__decorate([
    (0, graphql_1.Field)(type => [String]),
    __metadata("design:type", Array)
], UserType.prototype, "friends", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], UserType.prototype, "active", void 0);
__decorate([
    (0, graphql_1.Field)(type => [String]),
    __metadata("design:type", Array)
], UserType.prototype, "friendRequests", void 0);
__decorate([
    (0, graphql_1.Field)(type => [String]),
    __metadata("design:type", Array)
], UserType.prototype, "sentRequests", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], UserType.prototype, "notSeenCount", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserType.prototype, "lastVisited", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UserType.prototype, "lastMessage", void 0);
UserType = __decorate([
    (0, graphql_1.ObjectType)()
], UserType);
exports.UserType = UserType;
let TokenType = class TokenType {
};
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], TokenType.prototype, "token", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], TokenType.prototype, "message", void 0);
TokenType = __decorate([
    (0, graphql_1.ObjectType)()
], TokenType);
exports.TokenType = TokenType;
let SearchType = class SearchType {
};
__decorate([
    (0, graphql_1.Field)(type => [UserType], { nullable: true }),
    __metadata("design:type", Array)
], SearchType.prototype, "users", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], SearchType.prototype, "total", void 0);
SearchType = __decorate([
    (0, graphql_1.ObjectType)()
], SearchType);
exports.SearchType = SearchType;
let NewsType = class NewsType {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], NewsType.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], NewsType.prototype, "description", void 0);
NewsType = __decorate([
    (0, graphql_1.ObjectType)()
], NewsType);
exports.NewsType = NewsType;
let NotSeenType = class NotSeenType {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], NotSeenType.prototype, "count", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], NotSeenType.prototype, "by", void 0);
NotSeenType = __decorate([
    (0, graphql_1.ObjectType)()
], NotSeenType);
exports.NotSeenType = NotSeenType;
let MessageType = class MessageType {
};
__decorate([
    (0, graphql_1.Field)(type => [String]),
    __metadata("design:type", Array)
], MessageType.prototype, "between", void 0);
__decorate([
    (0, graphql_1.Field)(type => [Number]),
    __metadata("design:type", Array)
], MessageType.prototype, "sequence", void 0);
__decorate([
    (0, graphql_1.Field)(type => [String]),
    __metadata("design:type", Array)
], MessageType.prototype, "messages", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MessageType.prototype, "lastDate", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", NotSeenType)
], MessageType.prototype, "notSeen", void 0);
MessageType = __decorate([
    (0, graphql_1.ObjectType)()
], MessageType);
exports.MessageType = MessageType;
let RecoverType = class RecoverType {
};
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], RecoverType.prototype, "code", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecoverType.prototype, "successMessage", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecoverType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecoverType.prototype, "message", void 0);
RecoverType = __decorate([
    (0, graphql_1.ObjectType)()
], RecoverType);
exports.RecoverType = RecoverType;
//# sourceMappingURL=graphqlTypes.js.map