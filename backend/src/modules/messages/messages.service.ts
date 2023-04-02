import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserReq } from 'types/types';
import { getStartEndTotal } from 'src/functions/functions';
import { log } from 'console';


@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) { }


  async lastMessages(ctx:any,page: number, perPage: number) {
    const req: UserReq = ctx.req;
    const currentUser = req.session.user;
    const length = 100;
    log(currentUser);
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
