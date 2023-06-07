import { randomBytes } from "crypto";

import { UserReq } from "../../types/types";

export const getTestContext = () => {
    const randomId:string = randomBytes(12).toString("hex");
    const randomId2:string = randomBytes(12).toString("hex");
    return {
      req: {
        session: {
          user: {
            id: randomId,
            friendRequests: [randomId2]
          }
        }
      } as UserReq
    };
}