import {Injectable} from '@nestjs/common';
import {PrismaService} from 'nestjs-prisma';
import {UserReq} from 'types/types';
import { getStartEndTotal, sortByActivesFirst} from 'src/functions/functions';
import {GraphQLError} from "graphql";


@Injectable()
export class SearchService {
    constructor(private readonly prisma: PrismaService) {
    }

    async searchInAll(ctx:any,name: string, page: number, perPage: number) {
        let data: any[];
        if (!name) {
            data = await this.prisma.users.findMany();
        } else {
            data = await this.prisma.users.findMany({
                where: {
                    name: {
                        contains: name
                    }
                }
            });
        }

        const req: UserReq = ctx.req;
        
        if (req.session.user) {
            if (req.session.user.friends) {
                data = data.filter((el: any) => {
                        if (req.session.user.friends.includes(el.id) || el.id == req.session.user.id) {
                            return false;
                        }
                        return true;
                    }
                );
            }
        }
        ;

        const {startIndex, endIndex, total} = getStartEndTotal(page, perPage, data.length);

        data = sortByActivesFirst(data);
        data = data.slice(startIndex, endIndex);
        return {users: data, total};
    }


    async searchInFriends(ctx:any ,name: string, page: number, perPage: number) {
        const req: UserReq = ctx.req;
        if (req.session.user) {
            if (req.session.user.friends && req.session.user.friends.length) {
                const friendsArray: any[] = req.session.user.friends;
                let friends: any[]
                if (!name) {
                    friends = await this.prisma.users.findMany({
                        where: {
                            id: {in: friendsArray}
                        }
                    });
                } else if (name) {
                    friends = await this.prisma.users.findMany({
                        where: {
                            AND: [
                                {id: {in: friendsArray}},
                                {
                                    name: {
                                        contains: name
                                    }
                                }
                            ]
                        }
                    });
                }

                const {startIndex, endIndex, total} = getStartEndTotal(page, perPage, friends.length);
                friends = sortByActivesFirst(friends);
                friends = friends.splice(startIndex, endIndex);
                return {users: friends, total};
            } else {
                return {users: [], total: 1}
            }
        } else {
            return {message: "Not Signed In"}
        }
        ;

    }

    async findUserById(id: any):Promise<any> {
        return this.prisma.users.findUnique({
            where:
                {id}
        });
    }
}
