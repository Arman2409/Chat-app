import { Typography, theme, Pagination } from "antd";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "../../../store/store";

const { useToken } = theme;

import ListMaper from "../UsersMapper/UsersMapper";
import styles from "../../../styles/Users/UsersOnline.module.scss";
import globalStyles from "../../../styles/globalClasses.module.scss";
import handleGQLRequest from "../../../requests/handleGQLRequest";
import { UserType } from "../../../types/types";

const UsersList:React.FunctionComponent = () => {
   const isSmall = useMediaQuery({ query: "(max-width: 481px)"});
   const [ current, setCurrent] = useState<number>(1);
   const user: UserType = useSelector((state: IRootState) => state.user.user);
   const [users, setUsers] = useState<UserType[]>([]);
   const [total, setTotal] = useState<number>(1);
   // const isMiddle = useMediaQuery({ query: "(max-width: 768px)" });
   
   // const { token } = useToken();

   const getOnlineFriends = () => { 
      (async function(){
         const onlineFriends = await handleGQLRequest("GetOnlineFriends", {page: current, perPage:10});
         if(onlineFriends.GetOnlineFriends.users){
           setUsers(onlineFriends.GetOnlineFriends.data);
           setTotal(onlineFriends.GetOnlineFriends.total)
         } else {
           setUsers([]);
           setTotal(1);
         }
       })()
   }

   const changePage:Function = (e:any) => {
      setCurrent(e);
      getOnlineFriends();
   };

   useEffect(() => {
     getOnlineFriends();
   }, [user])

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
               total={total} 
               current={current} 
               onChange={(e) => changePage(e)}  
               showSizeChanger={false} />
         </div>
       </div>
   )
};

export default UsersList;