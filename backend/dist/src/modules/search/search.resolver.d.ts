import { SearchType, UserType } from "types/graphqlTypes";
import { SearchService } from "./search.service";
export declare class SearchResolver {
    private readonly search;
    constructor(search: SearchService);
    searchInAll(ctx: any, name: string, page: number, perPage: number): Promise<SearchType>;
    searchInFriends(ctx: any, name: string, page: number, perPage: number): Promise<any>;
    findUser(id: string): Promise<UserType>;
}
