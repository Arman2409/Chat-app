import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserReq } from 'types/types';
import { getStartEndTotal } from 'src/functions/functions';


@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) { }


  async lastMessages(ctx:any,page: number, perPage: number) {
    const req: UserReq = ctx.req;
    const currentUser = req.session.user;
    let length = 100;
    let messages = await this.prisma.messages.findMany({
      where: {
        between: {
          has: currentUser?.id
        }
      },
      take: length
    });

    if(messages.length < 100) {
      length = messages.length;
    }
    const { startIndex, endIndex, total } = getStartEndTotal(page, perPage, length);
    messages = messages.slice(startIndex, endIndex);
    return {total, users: messages.map(async message => {
        const lastMessage = message?.messages[message?.messages?.length - 1];
        const userId = message?.between?.filter((elem):any => elem !== currentUser.id)[0];
        return await this.prisma.users.findUnique({
          where: {
            id: userId as any
          }
        }).then((resp) => ({
          ...resp,
          lastMessage,
        }))
      })
    }
  }
}
