import { Resolver, Args, Query, Context } from "@nestjs/graphql"

import { AuthService } from "./auth.service";
import { TokenType, UserType } from "types/graphqlTypes";
import { UserReq } from "types/types";

@Resolver()
export class AuthResolver {
   constructor(private readonly auth: AuthService) { };

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
      return await this.auth.findUser(ctx, { email, password });
      
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