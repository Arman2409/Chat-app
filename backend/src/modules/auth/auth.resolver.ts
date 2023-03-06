import { Resolver, Args, Query } from "@nestjs/graphql"
import { RequestContext } from "nestjs-request-context";

import { AuthService } from "./auth.service";
import { TokenType, UserType } from "types/graphqlTypes";
import { UserReq } from "types/types";
import { JwtService } from "src/services/jwt/jwt.service";

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
      @Args("email") email: string,
      @Args("password") password: string,
   ): Promise<any> {
      const user = await this.auth.findUser({ email, password });
      return { token: this.jwt.sign(user) };
   }

   @Query(() => String, { name: "SignOut" })
   signOut() {
      const req: UserReq = RequestContext.currentContext.req;
      req.session.user = null;
      return "Signed Out";
   }

   @Query(() => UserType, { name: "AlreadySigned" })
   setSession(
      @Args("token") token: string
   ) {
      return this.auth.setSession(token);
   }
}