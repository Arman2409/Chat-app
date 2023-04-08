import { Resolver, Args, Query, Context } from "@nestjs/graphql"

import { AuthService } from "./auth.service";
import { TokenType, UserType } from "types/graphqlTypes";
import { UserReq } from "types/types";
import { JwtService } from "src/middlewares/jwt/jwt.service";

@Resolver()
export class AuthResolver {
   constructor(private readonly auth: AuthService,
      private readonly jwt: JwtService) { };

   @Query(() => UserType, { name: "SignUp" })
   async signUp(
      @Args("name") name: string,
      @Args("email") email: string,
      @Args("image") image: string,
      @Args("password") password: string): Promise<any> {
      return await this.auth.addUser({ name, email, password, image });
   }


   @Query(() => TokenType, { name: "SignIn" })
   async signIn(
      @Context() ctx:any,
      @Args("email") email: string,
      @Args("password") password: string,
   ): Promise<any> {
      const user = await this.auth.findUser(ctx, { email, password });
      return { token: this.jwt.sign(user) };
   }

   @Query(() => String, { name: "SignOut" })
   signOut(@Context() ctx:any) {
      const req: UserReq = ctx.req;
      req.session.user = null;
      return "Signed Out";
   }

   @Query(() => UserType, { name: "AlreadySigned" })
   setSession(
      @Context() ctx:any,
      @Args("token") token: string
   ):any {
      return this.auth.setSession(ctx, token);
   }
}