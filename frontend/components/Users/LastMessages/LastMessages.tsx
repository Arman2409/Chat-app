import { Pagination, Typography } from "antd";
import { useEffect, useState } from "react";

import UsersMapper from "../../Custom/UsersMapper/UsersMapper";
import { useRouter } from "next/router";
import { UserType } from "../../../types/types";
import handleGQLRequest from "../../../requests/handleGQLRequest";

const LastMessages:React.FC = () => {
   const [current, setCurrent] = useState<number>(1);
   const router:any = useRouter();
   const [currentUser, setCurrentUser] = useState<UserType>(router.query.name ? router.query : {});
    

   useEffect(() => {
      (async function() {
        const lastMessagesData = await handleGQLRequest("GetLastMessages", {page: current, perPage: 10});
        console.log(lastMessagesData);
      })()
   }, [current])

    return (
       <div style={{
         width: "40%"
       }}>
         <Typography className={""}>
            Last Messages
         </Typography>
         <div className="centered_users_cont">
            <UsersMapper users={[]} />
            <Pagination 
              current={current} 
              onChange={(e) => setCurrent(e)} 
              showSizeChanger={false} />
         </div>
       </div>
    )
};

export default LastMessages;