import { Args, Query, Resolver } from "@nestjs/graphql";
import { MessageType } from "types/graphqlTypes";
import { MessagesService } from "./messages.service";

@Resolver()
export class MessagesResolver {
    constructor(private readonly  service:MessagesService){}

    @Query(() => [MessageType], {name: "GetLastMessages"})
    async lastMessages(
        @Args("page") page:number,
        @Args("perPage") perPage:number
    ){
        return await this.service.lastMessages(page,perPage);
    }
}