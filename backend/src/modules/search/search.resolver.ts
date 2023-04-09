import { Resolver, Query, Args,Context } from "@nestjs/graphql";
import { SearchType, UserType } from "types/graphqlTypes";

import { SearchService } from "./search.service";

@Resolver()
export class SearchResolver {
    constructor(private readonly search: SearchService) { }

    @Query(() => SearchType, { name: "SearchInAll" })
    async searchInAll(
        @Context() ctx:any,
        @Args("name") name: string,
        @Args("page") page: number,
        @Args("perPage") perPage: number): Promise<SearchType> { 
        return await this.search.searchInAll(ctx,name, page, perPage);
    }

    @Query(() => SearchType, { name: "SearchInFriends" })
    async searchInFriends(
        @Context() ctx:any,
        @Args("name") name: string,
        @Args("page") page: number,
        @Args("perPage") perPage: number): Promise<any> { 
        return await this.search.searchInFriends(ctx ,name, page, perPage);
    }

    @Query(() =>  UserType, { name: "FindUserById" })
    async findUser(
        @Args("id") id: string): Promise<UserType> {
        return await this.search.findUserById(id);
    }
}