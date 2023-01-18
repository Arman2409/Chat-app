import { List, Avatar, Typography, Badge, message } from "antd";
import React from "react";
import {  useRouter } from "next/router";

import styles from "../../../styles/Users/UsersMapper.module.scss";
import { MapperProps } from "../../../types/types";
import handleGQLRequest from "../../../requests/handleGQLRequest";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../store/store";
import {UserType} from "../../../types/types";
import {Dispatch} from "@reduxjs/toolkit";
import {setInterlocutor} from "../../../store/messagesSlice";

const UsersMapper: React.FC<MapperProps> = ({ users, friends, accept }: MapperProps) => {
   const router:any = useRouter();
   const dispatch: Dispatch = useDispatch();
   const user = useSelector((state:IRootState) => {
       return state.user.user
   })

    const acceptRequest:Function = async (item:any) => {
       const accepted = accept ? await accept(item.id) : null;
       console.log(accepted);

    }

   const addFriend:Function = (e:number) => {

      (async function(){

      if(user.name) {
          const addStatus = await handleGQLRequest("AddFriend", {id:e});
         if(addStatus.AddFriend == "Request Sent") {
             message.success("Request Sent");
         }
      } else {
          message.warning("Sing in to add friends");
      }
      })()
   };

   const newChat:Function = (e: UserType) => {
       if(!user.name) {
           message.warning("Sign in to message");
           return;
       };
       dispatch(setInterlocutor(e));
       router.push("/myMessages");
   };

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
                onClick={() => newChat(item)}
               actions={!friends ? [
                  <a onClick={() => addFriend(item.id)}>Add Friend</a>] : accept ?
                   [<a onClick={() => acceptRequest(item)}>Accept</a>] : undefined}
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