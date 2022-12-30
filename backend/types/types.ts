import { Request } from "express" 
import { UserType } from "./graphqlTypes"

export interface UserReq  extends Request{ 
    user:Omit<UserType, "password"> 
}