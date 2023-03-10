import { Resolver , Query, Args} from "@nestjs/graphql";
import { SearchType, UserType, TokenType } from "types/graphqlTypes";
import { FriendsService } from "./friends.service";

@Resolver()
export class FriendsResolver{
  constructor(private readonly service: FriendsService) {}

  @Query(() => String, { name: 'AddFriend' })
  async addFriend(
    @Args('id') id: number
  ) {
    return await this.service.addFriend(id);
  }

  @Query(() => [UserType], { name: 'GetFriendRequestsUsers' })
  async getRequests(
    @Args('ids',{ type: () => [Number] }) arr: number[],
  ) {
    return await this.service.findRequestUsers();
  }

  @Query(() => TokenType, { name: "ConfirmFriend"})
  async confirmFriend(
      @Args( "friendId") id: number,
  ) {
    return this.service.confirmFriend(id);
  }

}
