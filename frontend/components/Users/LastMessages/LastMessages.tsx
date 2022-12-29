import { Pagination, Typography } from "antd";
import { useState } from "react";

import UsersMapper from "../UsersList/UsersList";
import users from "../../../users";
import globalStyles from "../../../styles/globalClasses.module.scss";

const LastMessages:React.FC = () => {
   const [current, setCurrent] = useState(1);

    return (
       <div style={{
         width: "40%"
       }}>
         <Typography>
            Last Messages
         </Typography>
         <div className={globalStyles.centered_users_cont}>
            <UsersMapper users={users} />
            <Pagination 
              current={current} 
              onChange={(e) => setCurrent(e)} 
              showSizeChanger={false} />
         </div>
       </div>
    )
};

export default LastMessages;