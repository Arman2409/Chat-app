import { Args, Context, Query, Resolver } from "@nestjs/graphql";
import { UserType } from "types/graphqlTypes";
import { MessagesService } from "./messages.service";

@Resolver()
export class MessagesResolver {
    constructor(private readonly  service:MessagesService){}

    @Query(() => [UserType], {name: "GetLastMessages"})
    async lastMessages(
        @Context() ctx:any,
        @Args("page") page:number,
        @Args("perPage") perPage:number
    ){
        return await this.service.lastMessages(ctx,page,perPage);
    }
}