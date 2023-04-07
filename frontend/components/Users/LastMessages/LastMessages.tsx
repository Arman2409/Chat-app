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
   const [total, setTotal] = useState(100);
   const [lastMessages, setLastMessages] = useState<any[]>([])

   useEffect(() => {
      (async function() {
        const lastMessagesData = await handleGQLRequest("GetLastMessages", {page: current, perPage: 10});
        setLastMessages(lastMessagesData?.GetLastMessages?.users);
        setTotal(lastMessagesData?.GetLastMessages?.total);
      })()
   }, [current])

    return (
       <div className={styles.lastMessages_cont}>
         <Typography className={styles.lastMessages_cont_title}>
            Last Messages
         </Typography>
         <div className="centered_users_cont">
            <UsersMapper lastMessages={true} users={lastMessages} />
            <Pagination 
              className="users_pagination"
              current={current} 
              total={total}
              showSizeChanger={false}
              onChange={(e) => setCurrent(e)} 
               />
         </div>
       </div>
    )
};

export default LastMessages;