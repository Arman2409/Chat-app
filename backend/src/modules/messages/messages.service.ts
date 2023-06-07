import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserReq } from 'types/types';
import { getStartEnd } from '../../functions/functions';


@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) { }


  async getLastMessages(ctx:any,
     page: number, 
     perPage: number) {
     const req: UserReq = ctx.req;
     const currentUser = req.session.user;
    
    let messages = await this.prisma.messages.findMany({
      where: {
        between: {
          has: currentUser.id
        }
      }
    });

    const length = messages.length;
    const { startIndex, endIndex } = getStartEnd(page, perPage);
    messages = messages.slice(startIndex, endIndex);
    
    const resp = {total: length, users: messages.map(async (message:any) => {
        const lastMessage = message?.messages[message?.messages?.length - 1];
        const notSeenCount = (message.notSeen.by === message?.between?.indexOf(currentUser.id)) ?  message?.notSeen?.count : 0;
        const userId = message?.between?.filter((elem:any) => elem !== currentUser.id)[0];
        return await this.prisma.users.findUnique({
          where: {
            id: userId as any
          }
        }).then((resp) =>  ({
          ...resp,
          lastMessage,
          notSeenCount
        }))
      }) || []
    }
    return resp;
    
  }
}
