import { useEffect, useState } from "react";
import { Typography } from "antd";

import UsersMapper from "../../Tools/UsersMapper/UsersMapper";
import handleGQLRequest from "../../../request/handleGQLRequest";
import styles from "../../../styles/Parts/LastMessages.module.scss";

const LastMessages:React.FC = () => {
   const [total, setTotal] = useState(100);
   const [lastMessages, setLastMessages] = useState<any[]>([])

   const getLastMessages = (page:number) => {
      (async function() {
         const lastMessagesData = await handleGQLRequest("GetLastMessages", {page});
         console.log(lastMessagesData);
         
         setLastMessages(curr => [...curr,...lastMessagesData?.GetLastMessages?.users || []]);
         setTotal(lastMessagesData?.GetLastMessages?.total);
       })();
   };


   useEffect(() => {
      getLastMessages(1);
   }, []);

    return (
       <div className={styles.lastMessages_cont}>
         <Typography className={styles.lastMessages_cont_title}>
            Last Messages
         </Typography>
         <div className="centered_users_cont">
            <UsersMapper getUsers={(page:number) => getLastMessages(page)} lastMessages={true} total={total} users={lastMessages} />
         </div>
       </div>
    )
};

export default LastMessages;