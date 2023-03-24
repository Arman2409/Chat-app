import { Pagination, Typography } from "antd";
import { useEffect, useState } from "react";

import UsersMapper from "../../Custom/UsersMapper/UsersMapper";
import { useRouter } from "next/router";
import { UserType } from "../../../types/types";
import handleGQLRequest from "../../../requests/handleGQLRequest";
import styles from "../../../styles/Users/LastMessages.module.scss";

const LastMessages:React.FC = () => {
   const [current, setCurrent] = useState<number>(1);
   const router:any = useRouter();
   const [lastMessages, setLastMessages] = useState<any[]>([])
   const [currentUser, setCurrentUser] = useState<UserType>(router.query.name ? router.query : {});
    

   useEffect(() => {
      (async function() {
        const lastMessagesData = await handleGQLRequest("GetLastMessages", {page: current, perPage: 10});
        console.log(lastMessagesData);
        setLastMessages(lastMessagesData?.GetLastMessages);
      })()
   }, [current])

    return (
       <div className={styles.lastMessages_cont}>
         <Typography className={""}>
            Last Messages
         </Typography>
         <div className="centered_users_cont">
            <UsersMapper lastMessages={true} users={lastMessages} />
            <Pagination 
              current={current} 
              onChange={(e) => setCurrent(e)} 
              showSizeChanger={false} />
         </div>
       </div>
    )
};

export default LastMessages;