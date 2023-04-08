import { Injectable } from '@nestjs/common';
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtService {
    sign(data:any):any {
        return jwt.sign(data, process.env.JWT_SECRET)
     }
 
    authenticate(token: string):any {
       return jwt.verify(token, process.env.JWT_SECRET);
    }
}
