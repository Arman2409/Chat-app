import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from "bcrypt";
import { UserType } from 'types/graphqlTypes';
import { GraphQLError } from 'graphql';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { UserReq } from 'types/types';
import { RequestContext } from 'nestjs-request-context';
import { JwtService } from "../../services/jwt/jwt.service";


@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly cloudinary: CloudinaryService) { };

    async addUser(user: Omit<UserType, "active">): Promise<any> {
        const { name, email, password } = user;
        let { image } = user;
        return await this.prisma.users.findUnique(
            {
                where: {
                    email: email
                }
            }).then(async (data) => {
                if (data) {
                    throw new GraphQLError("Email is already registered");
                } else {
                    // uploading the image to cloudinary if it exists 
                    if (image) {
                        const uploadDetails = await this.cloudinary.upload(image);
                        if (uploadDetails) {
                            if (uploadDetails.secure_url) {
                                image = uploadDetails.secure_url;
                            } else {
                                image = "";
                            }
                        }
                    } else {
                        image = "";
                    };
                    // hashing the password 
                    const hashedPassword: string = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

                    // creating the user 
                    return this.prisma.users.create(
                        {
                            data: {
                                name,
                                email,
                                image,
                                password: hashedPassword
                            }
                        }).then((res) => {
                            return res;
                        }).catch((e) => {
                            throw new GraphQLError(e.message.split(/\r?\n/));
                        });
                }
            })
    };


    async findUser(user: Omit<UserType, "active" | "name">): Promise<any> {
        const { email, password } = user;
        let resp: Omit<UserType, "password" | "active">;
        await this.prisma.users.findUnique(
            {
                where: {
                    email: email
                }
            }).then(async (data) => {
                if (data) {
                    await bcrypt.compare(password, data.password).then((result) => {
                        if (result) {
                            delete data.password;
                            resp = data;
                            const req: UserReq = RequestContext.currentContext.req;
                            req.session.user = data;
                            return data;
                        } else {
                            throw new GraphQLError("Wrong Password")
                        }
                    })
                } else {
                    throw new GraphQLError("User Not Found")
                }
            }).catch(() => {
                throw new GraphQLError("User Not Found")
            });
        return resp;
    };

    async setSession(token: string) {
        const req: UserReq = RequestContext.currentContext.req;
        const userData = this.jwt.authenticate(token);
        return this.prisma.users.findUnique({
            where: {
                email: userData.email
            }
        }).then((data) => {
            req.session.user = data;
            return data;
        }).catch((e) => {
            throw new GraphQLError(e.message);
        });
    }
}
