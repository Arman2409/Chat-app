import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { GraphQLError } from 'graphql';

import { JwtService } from "../../middlewares/jwt/jwt.service";
import { UserType } from '../../../types/graphqlTypes';
import { UserReq } from '../../../types/types';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService,
              private readonly jwt:JwtService) {
  };

  async addFriend(ctx:any , id: any):Promise<any> {
    const req: UserReq = ctx.req;
    const currentUser = req.session.user;
    if(!currentUser) {
       throw new GraphQLError("Not Signed In");
    }
    const requestingUser = await this.prisma.users.findUnique({
      where: {
        id: id
      },
    });
    if (!requestingUser) {
      throw new GraphQLError("Friend Request Not Send, Error Occurred");
    };
  

    const newRequests = requestingUser?.friendRequests;
    const sentRequests = currentUser?.sentRequests;

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
      throw {message: "Not Sent, Error Occured"};
    }
  }

  async removeFriend(ctx:any , id: any):Promise<any> {
    const req: UserReq = ctx.req;
    const currentUser = req.session.user;
    if(!currentUser) {
      throw new GraphQLError("Not Signed In");
    }
    const index: number = currentUser.friends.indexOf(id);
    currentUser.friends.splice(index, 1);
    const updating = await this.prisma.users.update({
      where: {
        id: currentUser.id
      },
      data: {
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
    const friendIndex: number = friend.friends.indexOf(currentUser.id);
    friend.friends.splice(friendIndex, 1);
    const updatingFriend = await this.prisma.users.update({
      where: {
        id
      },
      data: {
        friends: friend.friends
      }
    })
    if (updatingFriend) {
      return {token: this.jwt.sign(currentUser)};
    } else {
      return {message: "Not Removed, Error Occured"};
    }
  }

  async findRequestUsers(ctx:any):Promise<any> {
    const req: UserReq = ctx.req;
    return await this.prisma.users.findMany({
      where: {
        id: { in: req.session?.user?.friendRequests }
      }
    })
  };

  async confirmFriend(ctx:any,id: any) {
    const req: UserReq = ctx.req;
    const currentUser: UserType = req.session.user;
    if(!currentUser) {
      throw new GraphQLError("Not Signed In");
    }
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
    
    friend.friends.push(currentUser.id);
    delete friend.sentRequests[friend.sentRequests?.indexOf(currentUser.id)];
    delete friend.id;
    const updatingFriend = await this.prisma.users.update({
      where: {
        id
      },
      data: friend as any
    })
    if (updatingFriend) {
      return {token: this.jwt.sign(currentUser)};
    } else {
      return {message: "Not Confirmed, Error Occured"};
    }
  }
}