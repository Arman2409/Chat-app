import { Injectable } from '@nestjs/common';
import { UserReq } from 'types/types';
import { RequestContext } from 'nestjs-request-context';
import { PrismaService } from 'nestjs-prisma';
import { UserType } from 'types/graphqlTypes';

import { getStartEndTotal } from 'src/functions/functions';
import { GraphQLError } from 'graphql';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {
  };

  async getOnlineFriends(page: number, perPage: number): Promise<any> {
    const req: UserReq = RequestContext.currentContext.req;
    console.log({ user: req.session.user });

    if (req.session.user) {

      if (req.session.user.friends.length) {
        let onlineFriends: UserType[] = await this.prisma.users.findMany({
          where: {
              AND: [
                  { id: {in : req.session.user.friends}},
                  { active: true}
              ]
            }
        });
        const { startIndex, endIndex, total } = getStartEndTotal(page, perPage, onlineFriends.length);
        onlineFriends = onlineFriends.splice(startIndex, endIndex);

        return { data: onlineFriends, total };
      } else {
        return { data: [], total: 1 };
      }
    } else {
      return { data: [], total: 1 };
    }
  }

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
    }
    ;
    const newRequests = requestingUser.friendRequests;
    if (newRequests.includes(Number(currentUser.id))) {
      return "Already Sent";
    }
    if (newRequests.includes(Number(req.session.user.id))) {
      return "Can't Send Request To Yourself";
    }
    newRequests.unshift(Number(req.session.user.id));
    const update = await this.prisma.users.update({
      where: {
        id: Number(id)
      },
      data: {
        friendRequests: newRequests
      }
    })
    if (update) {
      return "Request Sent";
    } else {
      throw new GraphQLError("Not Sent, Error Occured");
    }
  }

  async findRequestUsers(arr) {
    return await this.prisma.users.findMany({
      where: {
        id: { in: arr }
      }
    })
  };

  async confirmFriend(id) {
    const req: UserReq = RequestContext.currentContext.req;
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
    console.log({ updating });
    req.session.user = currentUser;
    const friend: UserType = await this.prisma.users.findUnique({
      where: {
        id
      }
    });
    console.log({ friend });
    friend.friends.push(currentUser.id);
    const updatingFriend: UserType = await this.prisma.users.update({
      where: {
        id
      },
      data: {
        friends: friend.friends
      }
    })
    if (updatingFriend) {
      return "Friend Confirmed";
    } else {
      return "Error Occured";
    }
  }
}