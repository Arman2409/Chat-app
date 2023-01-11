import { List, Avatar, Typography, Badge } from "antd";
import { MapperProps, UserType } from "../../../types/types";
import React from "react";

import styles from "../../../styles/Users/UsersMapper.module.scss";
import {  useRouter } from "next/router";
import { BaseRouter } from "next/dist/shared/lib/router/router";
import handleGQLRequest from "../../../requests/handleGQLRequest";

const UsersMapper: React.FC<MapperProps> = ({ users, friends }: MapperProps) => {
   const router:any = useRouter();

   console.log(users);

   const addFriend:Function = (e:number) => {
      (async function(){
      const addStatus = await handleGQLRequest("AddFriend", {id:e});
      console.log(addStatus);
      })()
   };

   // const newChat:Function = (e: UserType) => {
   //    router.push({
   //       pathname: "/myMessages",
   //       query: e
   //    });
   // };

   return (
      <List
         itemLayout="horizontal"
         dataSource={users}
         style={{
            width: "100%",
            maxWidth: "550px",
         }}
         renderItem={(item) => (
            <List.Item
               actions={!friends ? [
                  <a onClick={() => addFriend(item.id)}>Add Friend</a>] : undefined}
               className={styles.list_item}
               >
               <List.Item.Meta
                  avatar={<Badge dot={item.active ? true : false}>
                     <Avatar src={item.image} />
                  </Badge>}

                  title={<Typography>{item.name}</Typography>}
                  description={`${item.description}`}>
               </List.Item.Meta>
            </List.Item>
         )}
      >
      </List>
   )
}

export default UsersMapper;