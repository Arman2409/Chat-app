import { Request } from "express" 
import { Session } from "express-session"
import { UserType } from "./graphqlTypes"

export interface UserReq  extends Request{ 
    session:Session & {user:Omit<UserType, "password"> }
}