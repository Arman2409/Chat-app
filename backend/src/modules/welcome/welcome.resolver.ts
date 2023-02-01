import { Resolver, Query } from "@nestjs/graphql";
import {NewsType} from "types/graphqlTypes";
import {WelcomeService} from "./welcome.service";

@Resolver()
export class WelcomeResolver {
    constructor(private readonly service: WelcomeService) { }

    @Query(() => [NewsType], { name: "GetWelcomeNews" })
    async getNews(): Promise<any> {
        return await this.service.getNews();
    }
}