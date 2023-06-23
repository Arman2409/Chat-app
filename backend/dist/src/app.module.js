"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const nestjs_prisma_1 = require("nestjs-prisma");
const mailer_1 = require("@nestjs-modules/mailer");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const auth_module_1 = require("./modules/auth/auth.module");
const jwt_service_1 = require("./middlewares/jwt/jwt.service");
const cloudinary_service_1 = require("./middlewares/cloudinary/cloudinary.service");
const search_module_1 = require("./modules/search/search.module");
const friends_module_1 = require("./modules/friends/friends.module");
const messages_module_1 = require("./modules/messages/messages.module");
const sockets_module_1 = require("./modules/sockets/sockets.module");
const welcome_module_1 = require("./modules/welcome/welcome.module");
const files_module_1 = require("./modules/files/files.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            graphql_1.GraphQLModule.forRoot({
                context: ({ req, res }) => ({ req, res }),
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                debug: false
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '../../../', 'frontend/out/'),
            }),
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (config) => ({
                    transport: {
                        host: process.env.EMAIL_HOST,
                        secure: false,
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASSWORD,
                        },
                    },
                    defaults: {
                        from: 'talkSpace'
                    },
                }),
                inject: [config_1.ConfigService]
            }),
            auth_module_1.AuthModule,
            search_module_1.SearchModule,
            friends_module_1.FriendsModule,
            sockets_module_1.SocketsModule,
            messages_module_1.MessagesModule,
            welcome_module_1.WelcomeModule,
            files_module_1.FilesModule
        ],
        providers: [nestjs_prisma_1.PrismaService, jwt_service_1.JwtService, cloudinary_service_1.CloudinaryService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map