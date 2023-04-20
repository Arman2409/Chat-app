import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from "bcrypt";
import { UserType } from 'types/graphqlTypes';
import { GraphQLError } from 'graphql';
import { CloudinaryService } from 'src/middlewares/cloudinary/cloudinary.service';
import { UserReq } from 'types/types';
import { JwtService } from "../../middlewares/jwt/jwt.service";
import { MailerService } from '@nestjs-modules/mailer';
import { random } from 'lodash';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly mailerService: MailerService,
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


    async findUser(ctx:any ,user: Omit<UserType, "active" | "name">): Promise<any> {
        const { email, password } = user;
        let resp:any;

         await this.prisma.users.findUnique(
            {
                where: {
                    email: email
                }
            }).then(async (data) => {
                if(!data) {
                    resp = {message: "User Not Found"}
                }                
                if (data) {
                    await bcrypt.compare(password, data.password).then( async (result) => {
                        if (result) {
                            delete data.password;
                            data.id = String(data.id);                           
                            const req: UserReq = ctx.req;
                            req.session.user = data;                            
                            resp = { token: await this.jwt.sign(data) };
                        } else {
                            resp = { message: "Wrong Password" }
                        }
                    })
                };
            }).catch(() => {
                resp = {message: "User Not Found"}
            });
            return resp;
            
    };

    async setSession(ctx:any ,token: string):Promise<any> {
        const req: UserReq = ctx.req;
        const userData = this.jwt.authenticate(token);
        return this.prisma.users.findUnique({
            where: {
                email: userData.email
            }
        }).then((data) => {
            req.session.user = data;
            return data;
        }).catch((e) => {
             return {message: e.message};
        });
    }

    async recoverEmail(email: string):Promise<any>{
      const recoverPassword = random(100000, 999999);
      console.log(email,recoverPassword);
      const user = await this.prisma.users.findUnique({
          where: {
            email
          }
      });
       if(user?.email) {

        return await this.mailerService.sendMail({
            to: email,
            subject: 'Recover password for TalkSpace account',
            text: `Your recovery password is ${recoverPassword.toString()}`
        }).then(() => {
            return {code: recoverPassword};
        }).catch(() => {
            return {message: "Error Occured"};
        }) ;
        
       } else {
         return {
            message: "User not found"
         }
       }
    }
}
