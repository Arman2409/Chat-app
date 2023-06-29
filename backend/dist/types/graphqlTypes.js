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
exports.UploadFileType = exports.FileType = exports.UploadType = exports.RecoverType = exports.MessagesType = exports.MessageType = exports.MessageFileType = exports.NotSeenType = exports.NewsType = exports.SearchType = exports.TokenType = exports.UserType = void 0;
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
    (0, graphql_1.Field)(type => [String]),
    __metadata("design:type", Array)
], UserType.prototype, "blockedUsers", void 0);
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
let MessageFileType = class MessageFileType {
};
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MessageFileType.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MessageFileType.prototype, "originalName", void 0);
MessageFileType = __decorate([
    (0, graphql_1.ObjectType)()
], MessageFileType);
exports.MessageFileType = MessageFileType;
let MessageType = class MessageType {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MessageType.prototype, "text", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", MessageFileType)
], MessageType.prototype, "file", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MessageType.prototype, "audio", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], MessageType.prototype, "sentBy", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MessageType.prototype, "date", void 0);
MessageType = __decorate([
    (0, graphql_1.ObjectType)()
], MessageType);
exports.MessageType = MessageType;
let MessagesType = class MessagesType {
};
__decorate([
    (0, graphql_1.Field)(type => [String]),
    __metadata("design:type", Array)
], MessagesType.prototype, "between", void 0);
__decorate([
    (0, graphql_1.Field)(type => [String]),
    __metadata("design:type", Array)
], MessagesType.prototype, "messages", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", NotSeenType)
], MessagesType.prototype, "notSeen", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], MessagesType.prototype, "blocked", void 0);
MessagesType = __decorate([
    (0, graphql_1.ObjectType)()
], MessagesType);
exports.MessagesType = MessagesType;
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
let UploadType = class UploadType {
};
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UploadType.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UploadType.prototype, "originalName", void 0);
UploadType = __decorate([
    (0, graphql_1.ObjectType)()
], UploadType);
exports.UploadType = UploadType;
let FileType = class FileType {
};
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], FileType.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], FileType.prototype, "originalName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], FileType.prototype, "data", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], FileType.prototype, "contentType", void 0);
FileType = __decorate([
    (0, graphql_1.ObjectType)()
], FileType);
exports.FileType = FileType;
let UploadFileType = class UploadFileType {
};
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UploadFileType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UploadFileType.prototype, "data", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UploadFileType.prototype, "originalName", void 0);
UploadFileType = __decorate([
    (0, graphql_1.ObjectType)()
], UploadFileType);
exports.UploadFileType = UploadFileType;
//# sourceMappingURL=graphqlTypes.js.map