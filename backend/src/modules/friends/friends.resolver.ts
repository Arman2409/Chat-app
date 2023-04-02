import { Resolver , Query, Args, Context} from "@nestjs/graphql";
import { UserType, TokenType } from "types/graphqlTypes";
import { FriendsService } from "./friends.service";

@Resolver()
export class FriendsResolver{
  constructor(private readonly service: FriendsService) {}

  @Query(() => UserType, { name: 'AddFriend' })
  async addFriend(
    @Context() ctx:any,
    @Args('id') id: string
  ) {
    return await this.service.addFriend(ctx ,id);
  }

  @Query(() => [UserType], { name: 'GetFriendRequestsUsers' })
  async getRequests(
    @Context() ctx:any,
    @Args('ids',{ type: () => [String] }) arr: number[],
  ) {
    return await this.service.findRequestUsers(ctx);
  }

  @Query(() => TokenType, { name: "ConfirmFriend"})
  async confirmFriend(
      @Context() ctx:any,
      @Args( "friendId") id: string,
  ) {
    return this.service.confirmFriend(ctx, id);
  }

}
