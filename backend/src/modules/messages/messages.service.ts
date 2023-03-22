import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserReq } from 'types/types';
import { RequestContext } from 'nestjs-request-context';
import { getStartEndTotal } from 'src/functions/functions';
import { UserType } from 'types/graphqlTypes';
import { resolve } from 'path';


@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) { }


  async lastMessages(page: number, perPage: number) {
    const req: UserReq = RequestContext.currentContext.req;
    const currentUser = req.session.user;
    const length = 100;
    let messages = await this.prisma.messages.findMany({
      where: {
        between: {
          has: currentUser?.id
        }
      },
      take: length
    });

    const { startIndex, endIndex, total } = getStartEndTotal(page, perPage, length);
    messages = messages.slice(startIndex, endIndex);
      return messages.map(async message => {
        const lastMessage = message?.messages[message?.messages?.length - 1];
        const userId = message?.between?.filter(elem => elem !== currentUser.id)[0];
        return await this.prisma.users.findUnique({
          where: {
            id: userId
          }
        }).then((resp) => ({
          ...resp,
          lastMessage,
        }))
      })
  }
}
