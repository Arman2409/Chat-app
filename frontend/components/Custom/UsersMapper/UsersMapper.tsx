import { List, Avatar, Typography, Badge, message } from "antd";
import React, {useRef} from "react";
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
    const acceptLink = useRef<null|any>(null);

    const acceptRequest:Function = async (item:any, e:Event) => {
        e.stopPropagation();
        accept ? await accept(item.id) : null;
    }

   const addFriend:Function = (e:number, event: Event) => {
        event.stopPropagation();
      (async function(){

      if(user.name) {
          const addStatus = await handleGQLRequest("AddFriend", {id:e});
         if(addStatus.AddFriend == "Request Sent") {
             message.success("Request Sent");
         }
      } else {
          message.warning("Sign in to add friends");
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
        className={styles.list}
         renderItem={(item) => (
            <List.Item
                onClick={() => newChat(item)}
               actions={!friends && user.name ? [
              ] : accept ?
                   [<a  className={styles.list_item_action} ref={acceptLink} onClick={(e) => acceptRequest(item,e)}>Accept</a>] : undefined}
               className={styles.list_item}
               >
                <Badge dot={item.active ? true : false}>
                       <Avatar src={item.image} />
                </Badge>
                <div>
                  <Typography>{item.name}</Typography>
                    {!item.active && <Typography className="list_item_date">{item.lastVisited}</Typography>}
                </div>
                {!friends && user.name ? <a className={styles.list_item_action} onClick={(e) => addFriend(item.id, e)}>Add Friend</a> : accept ?
                    <a  className={styles.list_item_action} ref={acceptLink} onClick={(e) => acceptRequest(item,e)}>Accept</a> : null}
            </List.Item>
         )}
      />
   )
}

export default UsersMapper;