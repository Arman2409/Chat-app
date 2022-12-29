import { Typography, theme, Pagination } from "antd";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";

const { useToken } = theme;

import users from "../../../users";
import ListMaper from "../UsersList/UsersList";
import styles from "../../../styles/Users/UsersOnline.module.scss";
import globalStyles from "../../../styles/globalClasses.module.scss";

const UsersList:React.FunctionComponent = () => {
   const isSmall = useMediaQuery({ query: "(max-width: 481px)"});
   const [ current, setCurrent] = useState<number>(1);
   // const isMiddle = useMediaQuery({ query: "(max-width: 768px)" });
   
   // const { token } = useToken();

   const changePage:Function = (e:any) => {
      console.log(e);
      setCurrent(e);
   };

   return (
      <div 
      className={styles.users_online_cont}
      style={{
         width: isSmall ? "100%" :  "40%",
      }}>
         <Typography >
            Friends Online
         </Typography>
         <div className={globalStyles.centered_users_cont}>
            <ListMaper users={users} />
            <Pagination 
               total={500} 
               current={current} 
               onChange={(e) => changePage(e)}  
               showSizeChanger={false} />
         </div>
       </div>
   )
};

export default UsersList;