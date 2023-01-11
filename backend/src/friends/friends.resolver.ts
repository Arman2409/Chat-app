import { Resolver , Query, Args} from "@nestjs/graphql";
import { SearchType } from "types/graphqlTypes";
import { FriendsService } from "./friends.service";

@Resolver()
export class FriendsResolver{
    constructor(private readonly service:FriendsService){}

    @Query(() => SearchType, {name: "GetOnlineFriends"})
    async getFriends(
        @Args("page") page:number,
        @Args("perPage") perPage:number
      ) {
         return await this.service.getOnlineFriends(page, perPage);;
    }

    @Query(() => String, {name: "AddFriend"})
    async addFriend(
        @Args("id") id:number,
      ) {
        return await this.service.addFriend(id);
    }

}