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
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const auth_service_1 = require("./auth.service");
const graphqlTypes_1 = require("../../../types/graphqlTypes");
let AuthResolver = class AuthResolver {
    constructor(service) {
        this.service = service;
    }
    ;
    async signUp(name, email, image, password) {
        return await this.service.addUser({ name, email, password, image });
    }
    async signIn(ctx, email, password) {
        return await this.service.findUser(ctx, { email, password });
    }
    signOut(ctx) {
        return this.service.signOut(ctx);
        ;
    }
    setSession(ctx, token) {
        return this.service.setSession(ctx, token);
    }
    recoverPassword(email) {
        return this.service.recoverEmail(email);
    }
    changePassword(id, password) {
        return this.service.confirmNewPassword(id, password);
    }
};
__decorate([
    (0, graphql_1.Query)(() => graphqlTypes_1.UserType, { name: "SignUp" }),
    __param(0, (0, graphql_1.Args)("name")),
    __param(1, (0, graphql_1.Args)("email")),
    __param(2, (0, graphql_1.Args)("image")),
    __param(3, (0, graphql_1.Args)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "signUp", null);
__decorate([
    (0, graphql_1.Query)(() => graphqlTypes_1.TokenType, { name: "SignIn" }),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)("email")),
    __param(2, (0, graphql_1.Args)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "signIn", null);
__decorate([
    (0, graphql_1.Query)(() => String, { name: "SignOut" }),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthResolver.prototype, "signOut", null);
__decorate([
    (0, graphql_1.Query)(() => graphqlTypes_1.UserType, { name: "AlreadySigned" }),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Object)
], AuthResolver.prototype, "setSession", null);
__decorate([
    (0, graphql_1.Query)(() => graphqlTypes_1.RecoverType, { name: "RecoverPassword" }),
    __param(0, (0, graphql_1.Args)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], AuthResolver.prototype, "recoverPassword", null);
__decorate([
    (0, graphql_1.Query)(() => graphqlTypes_1.RecoverType, { name: "ConfirmRecoveredPassword" }),
    __param(0, (0, graphql_1.Args)("id")),
    __param(1, (0, graphql_1.Args)("newPassword")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Object)
], AuthResolver.prototype, "changePassword", null);
AuthResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthResolver);
exports.AuthResolver = AuthResolver;
//# sourceMappingURL=auth.resolver.js.map