"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeModule = void 0;
const common_1 = require("@nestjs/common");
const welcome_service_1 = require("./welcome.service");
const nestjs_prisma_1 = require("nestjs-prisma");
const welcome_resolver_1 = require("./welcome.resolver");
let WelcomeModule = class WelcomeModule {
};
WelcomeModule = __decorate([
    (0, common_1.Module)({
        providers: [welcome_service_1.WelcomeService, nestjs_prisma_1.PrismaService, welcome_resolver_1.WelcomeResolver]
    })
], WelcomeModule);
exports.WelcomeModule = WelcomeModule;
//# sourceMappingURL=welcome.module.js.map