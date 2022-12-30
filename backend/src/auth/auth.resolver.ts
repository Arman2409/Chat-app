import { Resolver,Args, Query } from "@nestjs/graphql"
import { RequestContext } from "nestjs-request-context";

import { AuthService } from "./auth.service";
import { UserType } from "types/graphqlTypes";
import { UserReq } from "types/types";

@Resolver()
export class AuthResolver {
   constructor(private readonly auth: AuthService){};
   
   @Query(() => UserType, {name: "SignUp"}) 
       async signUp(
                 @Args("name") name:string,
                 @Args("email") email:string,
                 @Args("image") image:string,
                 @Args("password") password:string): Promise<any> {   
           return  this.auth.addUser({name, email, password, image});
   }


   @Query(() => UserType, {name: "SignIn"}) 
       async signIn(
                 @Args("email") email:string,
                 @Args("password") password:string,
                 ): Promise<any> {         
         const user = await this.auth.findUser({email, password});
         const req:UserReq = RequestContext.currentContext.req;
         console.log(req);
         req.user = user;
         console.log(req.user);
         return user;
   }

   @Query(() => String, {name: "SignOut"})
      signOut() {
         // const session:UserSession = RequestContext.currentContext.req.session;
         // console.log(session);
         const req:UserReq = RequestContext.currentContext.req;
         req.user = null;
         return "Signed Out";
      }
}