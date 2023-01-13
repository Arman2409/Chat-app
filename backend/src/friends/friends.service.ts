import { Injectable } from '@nestjs/common';
import { UserReq } from 'types/types';
import { RequestContext } from 'nestjs-request-context';
import { PrismaService } from 'nestjs-prisma';
import { UserType } from 'types/graphqlTypes';

import { getStartEndTotal } from 'src/functions/functions';
import { GraphQLError } from 'graphql';

@Injectable()
export class FriendsService {
    constructor(private readonly prisma: PrismaService) {};

    async getOnlineFriends(page:number, perPage:number):Promise<any> {
        const req:UserReq = RequestContext.currentContext.req;
        console.log({user:req.session.user});

        if(req.session.user) {
            
            if(req.session.user.friends.length) {
                const allUsers:UserType[] = await this.prisma.users.findMany();
                
                let activeFriends:UserType[] = allUsers.filter((e) => req.session.user.friends.includes(e.id) && e.active)
                const {startIndex, endIndex, total} = getStartEndTotal(page, perPage, activeFriends.length);
                activeFriends = activeFriends.splice(startIndex, endIndex);
                console.log({activeFriends});
                
                return {data: activeFriends, total};
            } else {
                return {data: [], total: 1};
            }
        } else {
            return {data: [], total: 1};
        }
    }

    async addFriend(id:number){
        const req:UserReq = RequestContext.currentContext.req;
        const currentUser = req.session.user;
        const requestingUser = await this.prisma.users.findUnique({
           where: {
            id: Number(id)
           },
        });
        if(!requestingUser) {
           throw new GraphQLError("Friend Request Not Send, Error Occured");
        };
        const newRequests = requestingUser.friendRequests;
        if(newRequests.includes(Number(req.session.user.id))){
            return "Already Sent";
        }
        if(newRequests.includes(Number(req.session.user.id))){
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
         if(update){
            return "Request Sent";
         } else {
            throw new GraphQLError("Not Sent, Error Occured");
         }
    }
}
