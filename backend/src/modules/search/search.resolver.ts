import { Resolver, Query, Args } from "@nestjs/graphql";
import { SearchType, UserType } from "types/graphqlTypes";
import { SearchService } from "./search.service";

@Resolver()
export class SearchResolver {
    constructor(private readonly search: SearchService) { }

    @Query(() => SearchType, { name: "SearchInAll" })
    async searchInAll(
        @Args("name") name: string,
        @Args("page") page: number,
        @Args("perPage") perPage: number): Promise<SearchType> { 
        return await this.search.searchInAll(name, page, perPage);
    }

    @Query(() => SearchType, { name: "SearchInFriends" })
    async searchInFriends(
        @Args("name") name: string,
        @Args("page") page: number,
        @Args("perPage") perPage: number): Promise<SearchType> { 
        return await this.search.searchInFriends(name, page, perPage);
    }

    @Query(() =>  UserType, { name: "FindUserById" })
    async findUser(
        @Args("id") id: number): Promise<UserType> {
        return await this.search.findUserById(id);
    }
}