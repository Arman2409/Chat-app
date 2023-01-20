import { Request } from "express" 
import { Session } from "express-session"
import { UserType } from "./graphqlTypes"
import {Socket} from "socket.io";

export interface UserReq  extends Request{
    session:Session & {user:Omit<UserType, "password"> }
}

export interface SocketWIthHandshake extends Socket{
    handshake: any
}