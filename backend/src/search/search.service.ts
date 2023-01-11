import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserReq } from 'types/types';
import { RequestContext } from 'nestjs-request-context';
import { capitalizeFirstLetter, getStartEndTotal } from 'src/functions/functions';

@Injectable()
export class SearchService {
    constructor(private readonly prisma: PrismaService) { }

    async searchInAll(name: string, page: number, perPage: number) {
        let data: any[] = [];
        if (!name) {
            data = await this.prisma.users.findMany();
        } else {
            data = await this.prisma.users.findMany({
                where: {
                    name: { in: [name, name.toLowerCase(), capitalizeFirstLetter(name)] }
                }
            });
        }

        const req: UserReq = RequestContext.currentContext.req;
        if (req.session.user) {
            if (req.session.user.friends) {
                data = data.filter((el: any) => {
                    if (req.session.user.friends.includes(el.id)) {
                        return false;
                    }
                    return true;
                }
                );
            }
        };

        const { startIndex, endIndex, total } = getStartEndTotal(page, perPage, data.length);

        data = data.splice(startIndex, endIndex);

        return { users: data, total };
    }

      
    async searchInFriends(name: string, page: number, perPage: number) {
        let data: any[] = [];
        if (!name) {
            data = await this.prisma.users.findMany();
        } else {
            data = await this.prisma.users.findMany({
                where: {
                    name: { in: [name, name.toLowerCase(), capitalizeFirstLetter(name)] }
                }
            });
        }
        
        const req: UserReq = RequestContext.currentContext.req;
        if (req.session.user) {
            if (req.session.user.friends && req.session.user.friends.length) {
                data =  data.filter((el: any) => {
                    console.log(req.session.user.friends);
                    if (req.session.user.friends.includes(el.id)) {
                        console.log("true");
                        
                        if (el.name.toLowerCase() == name.toLowerCase()) {
                            return true;
                        }
                    }
                    return false;
                });
                const { startIndex, endIndex, total } = getStartEndTotal(page, perPage, data.length);
                data = data.splice(startIndex, endIndex);
                return { users: data, total };
            } else {
                return { users: [], total: 1 }
            }
        } else {
            return { users: [], total: 1 }
        };

    }
}
