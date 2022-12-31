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
}