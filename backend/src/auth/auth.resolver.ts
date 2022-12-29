import {Resolver,Args, Query} from "@nestjs/graphql"

@Resolver()
export class AuthResolver {

   @Query(() => String)
   helloWorld(): string {
      return "Hola Mundo";
   }
   
   @Query(() => String, {name: "addUser"}) 
   addUser(@Args("name") name:string, @Args("email") email:string,@Args("password") password:string): string {
       return "Added";
   }
}