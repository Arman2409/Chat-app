import { Injectable } from '@nestjs/common';
import { UserReq } from 'types/types';
import { RequestContext } from 'nestjs-request-context';
import { PrismaService } from 'nestjs-prisma';
import { UserType } from 'types/graphqlTypes';
import { GraphQLError } from 'graphql';

import { JwtService } from "../../services/jwt/jwt.service";
@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService,
              private readonly jwt:JwtService) {
  };

  async addFriend(ctx:any , id: any):Promise<any> {
    const req: UserReq = ctx.req;
    const currentUser = req.session.user;
    const requestingUser = await this.prisma.users.findUnique({
      where: {
        id: id
      },
    });
    if (!requestingUser) {
      throw new GraphQLError("Friend Request Not Send, Error Occurred");
    };
  

    const newRequests = requestingUser.friendRequests;
    const sentRequests = currentUser.sentRequests;

    if (newRequests.includes(currentUser.id) || sentRequests.includes(id)) {
      throw new GraphQLError( "Already Sent");
    }
    if (id === currentUser.id) {
      throw new GraphQLError("Can't Send Request To Yourself");
    }

    sentRequests.unshift(id)
    newRequests.unshift(currentUser.id)

    const updateCurrent = await this.prisma.users.update({
      where: {
        id: String(currentUser.id)
      },
      data: {
        sentRequests
      }
    });
    req.session.user = {...currentUser, sentRequests};
    const update = await this.prisma.users.update({
      where: {
        id: id
      },
      data: {
        friendRequests: newRequests
      }
    })
    if (update && updateCurrent) {
      return updateCurrent;
    } else {
      throw new GraphQLError("Not Sent, Error Occured");
    }
  }

  async findRequestUsers(ctx:any):Promise<any> {
    const req: UserReq = ctx.req;
    return await this.prisma.users.findMany({
      where: {
        id: { in: req.session.user.friendRequests }
      }
    })
  };

  async confirmFriend(ctx:any,id: any) {
    const req: UserReq = ctx.req;
    const currentUser: UserType = req.session.user;
    currentUser.friends.push(id);
    const index: number = currentUser.friendRequests.indexOf(id);
    currentUser.friendRequests.splice(index, 1);
    const updating = await this.prisma.users.update({
      where: {
        id: currentUser.id
      },
      data: {
        friendRequests: currentUser.friendRequests,
        friends: currentUser.friends
      }
    });
    if(!updating) {
      throw new GraphQLError("Error Occured")
    }
    req.session.user = currentUser;
    const friend: UserType = await this.prisma.users.findUnique({
      where: {
        id
      }
    });
    if(friend.friends.includes(id)) {
      return new GraphQLError("Already have friend");
    }
    friend.friends.push(currentUser.id);
    const friends = friend.friends;
    const friendRequests = friend.sentRequests.splice(Number(currentUser.id), 1);
    const updatingFriend: UserType = await this.prisma.users.update({
      where: {
        id
      },
      data: {
        friends,
        sentRequests: friendRequests
      }
    })
    if (updatingFriend) {
      return {token: this.jwt.sign(currentUser)};
    } else {
      return new GraphQLError("Not Confirmed, Error Occured");
    }
  }
}