import { Resolver, Args, Query, Context } from "@nestjs/graphql"

import { AuthService } from "./auth.service";
import { RecoverType, TokenType, UserType } from "../../../types/graphqlTypes";
import { UserReq } from "../../../types/types";

@Resolver()
export class AuthResolver {
   constructor(private readonly service: AuthService) { };

   @Query(() => UserType, { name: "SignUp" })
   async signUp(
      @Args("name") name: string,
      @Args("email") email: string,
      @Args("image") image: string,
      @Args("password") password: string): Promise<any> {
      return await this.service.addUser({ name, email, password, image });
   }


   @Query(() => TokenType, { name: "SignIn" })
   async signIn(
      @Context() ctx:any,
      @Args("email") email: string,
      @Args("password") password: string,
   ): Promise<any> {
      return await this.service.findUser(ctx, { email, password });
   }

   @Query(() => String, { name: "SignOut" })
   signOut(@Context() ctx:any) {
      return this.service.signOut(ctx); ;
   }

   @Query(() => UserType, { name: "AlreadySigned" })
   setSession(
      @Context() ctx:any,
      @Args("token") token: string
   ):any {
      return this.service.setSession(ctx, token);
   }

   @Query(() => RecoverType, { name: "RecoverPassword" })
   recoverPassword(
      @Args("email") email: string
   ):any {
      return this.service.recoverEmail(email);
   }

   @Query(() => RecoverType, { name: "ConfirmRecoveredPassword" })
   changePassword(
      @Args("id") id:string,
      @Args("newPassword") password: string,
   ):any {
      return this.service.confirmNewPassword(id, password);
   }
}