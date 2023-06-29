import { Request } from "express";
import { Session } from "express-session";
import { Socket } from "socket.io";
import { UserType } from "./graphqlTypes";
export interface UserReq extends Request {
    session: Session & {
        user: Omit<UserType, "password">;
    };
}
export interface SocketWIthHandshake extends Socket {
    handshake: any;
}
