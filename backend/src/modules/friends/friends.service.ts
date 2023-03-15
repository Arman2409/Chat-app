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

  async addFriend(id: number) {
    const req: UserReq = RequestContext.currentContext.req;
    const currentUser = req.session.user;
    const requestingUser = await this.prisma.users.findUnique({
      where: {
        id: Number(id)
      },
    });
    if (!requestingUser) {
      throw new GraphQLError("Friend Request Not Send, Error Occurred");
    };
  

    const newRequests = requestingUser.friendRequests;
    const sentRequests = currentUser.sentRequests;

    if (newRequests.includes(Number(currentUser.id)) || sentRequests.includes(Number(id))) {
      throw new GraphQLError( "Already Sent");
    }
    if (id === Number(currentUser.id)) {
      throw new GraphQLError("Can't Send Request To Yourself");
    }

    sentRequests.unshift(Number(id))
    newRequests.unshift(Number(currentUser.id))

    const updateCurrent = await this.prisma.users.update({
      where: {
        id: currentUser.id
      },
      data: {
        sentRequests
      }
    });
    req.session.user = {...currentUser, sentRequests};
    const update = await this.prisma.users.update({
      where: {
        id: Number(id)
      },
      data: {
        friendRequests: newRequests
      }
    })
    if (update && updateCurrent) {
      console.log(updateCurrent);
      
      return updateCurrent;
    } else {
      throw new GraphQLError("Not Sent, Error Occured");
    }
  }

  async findRequestUsers() {
    const req: UserReq = RequestContext.currentContext.req;
    return await this.prisma.users.findMany({
      where: {
        id: { in: req.session.user.friendRequests }
      }
    })
  };

  async confirmFriend(id: number) {
    const req: UserReq = RequestContext.currentContext.req;
    const currentUser: UserType = req.session.user;
    currentUser.friends.push(id);
    const index: number = currentUser.friendRequests.indexOf(id);
    const requests =  currentUser.friendRequests.splice(index, 1);
    const updating = await this.prisma.users.update({
      where: {
        id: currentUser.id
      },
      data: {
        friendRequests: requests,
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
    const friends = friend.friends.push(currentUser.id);
    const friendRequests = friend.sentRequests.splice(currentUser.id, 1);
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