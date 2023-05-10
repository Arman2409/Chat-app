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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
const bcrypt = require("bcrypt");
const graphql_1 = require("graphql");
const cloudinary_service_1 = require("../../middlewares/cloudinary/cloudinary.service");
const jwt_service_1 = require("../../middlewares/jwt/jwt.service");
const mailer_1 = require("@nestjs-modules/mailer");
const lodash_1 = require("lodash");
let AuthService = class AuthService {
    constructor(prisma, jwt, mailerService, cloudinary) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.mailerService = mailerService;
        this.cloudinary = cloudinary;
    }
    ;
    async addUser(user) {
        const { name, email, password } = user;
        let { image } = user;
        return await this.prisma.users.findUnique({
            where: {
                email: email
            }
        }).then(async (data) => {
            if (data) {
                throw new graphql_1.GraphQLError("Email is already registered");
            }
            else {
                if (image) {
                    const uploadDetails = await this.cloudinary.upload(image);
                    if (uploadDetails) {
                        if (uploadDetails.secure_url) {
                            image = uploadDetails.secure_url;
                        }
                        else {
                            image = "";
                        }
                    }
                }
                else {
                    image = "";
                }
                ;
                const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
                return this.prisma.users.create({
                    data: {
                        name,
                        email,
                        image,
                        password: hashedPassword
                    }
                }).then((res) => {
                    return res;
                }).catch((e) => {
                    throw new graphql_1.GraphQLError(e.message.split(/\r?\n/));
                });
            }
        });
    }
    ;
    async findUser(ctx, user) {
        const { email, password } = user;
        let resp;
        await this.prisma.users.findUnique({
            where: {
                email: email
            }
        }).then(async (data) => {
            if (!data) {
                resp = { message: "User Not Found" };
            }
            if (data) {
                await bcrypt.compare(password, data.password).then(async (result) => {
                    if (result) {
                        delete data.password;
                        data.id = String(data.id);
                        const req = ctx.req;
                        req.session.user = data;
                        resp = { token: await this.jwt.sign(data) };
                    }
                    else {
                        resp = { message: "Wrong Password" };
                    }
                });
            }
            ;
        }).catch(() => {
            resp = { message: "User Not Found" };
        });
        return resp;
    }
    ;
    async setSession(ctx, token) {
        const req = ctx.req;
        const userData = this.jwt.authenticate(token);
        return this.prisma.users.findUnique({
            where: {
                email: userData.email
            }
        }).then((data) => {
            req.session.user = data;
            return data;
        }).catch((e) => {
            return { message: e.message };
        });
    }
    async recoverEmail(email) {
        const recoverPassword = (0, lodash_1.random)(100000, 999999);
        const user = await this.prisma.users.findUnique({
            where: {
                email
            }
        });
        if (user === null || user === void 0 ? void 0 : user.email) {
            return await this.mailerService.sendMail({
                to: email,
                subject: 'Recover password for TalkSpace account',
                text: `Your recovery password is ${recoverPassword.toString()}`
            }).then(() => {
                return { code: recoverPassword, id: user.id };
            }).catch(() => {
                return { message: "Error Occured" };
            });
        }
        else {
            return {
                message: "User not found"
            };
        }
    }
    async confirmNewPassword(id, newPassword) {
        const user = await this.prisma.users.findUnique({
            where: {
                id
            }
        });
        if (user === null || user === void 0 ? void 0 : user.email) {
            const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT_ROUNDS));
            return await this.prisma.users.update({
                where: {
                    id
                },
                data: {
                    password: hashedPassword
                }
            }).then((res) => {
                return { successMessage: "Password changed succesfully" };
            }).catch(() => {
                return { message: "Failed" };
            });
        }
        else {
            return { message: "Failed" };
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService,
        jwt_service_1.JwtService,
        mailer_1.MailerService,
        cloudinary_service_1.CloudinaryService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map