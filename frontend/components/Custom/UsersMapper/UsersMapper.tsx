import {List, Avatar, Typography, Badge, message, ConfigProvider} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {RiUserSearchFill} from "react-icons/ri";

import styles from "../../../styles/Custom/UsersMapper.module.scss";
import {MapperProps} from "../../../types/types";
import handleGQLRequest from "../../../requests/handleGQLRequest";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../store/store";
import {UserType} from "../../../types/types";
import {Dispatch} from "@reduxjs/toolkit";
import {setInterlocutor} from "../../../store/messagesSlice";
import { setStoreUser } from "../../../store/userSlice";

const UsersMapper: React.FC<MapperProps> = ({users, friends, accept}: MapperProps) => {
    const [emptyText, setEmptyText] = useState<string>("");
    const router: any = useRouter();
    const dispatch: Dispatch = useDispatch();
    const user = useSelector((state: IRootState) => {
        return state.user.user
    })
    const acceptLink = useRef<null | any>(null);

    const acceptRequest: Function = async (item: any, e: Event) => {
        e.stopPropagation();
        accept ? await accept(item.id) : null;
    }

    const addFriend: Function = (e: number, event: Event) => {
        event.stopPropagation();
        (async function () {
            if (user.name) {
                const addStatus = await handleGQLRequest("AddFriend", {id: e});        
                if (addStatus?.AddFriend?.email) {
                    message.success("Request Sent");
                    dispatch(setStoreUser(addStatus.AddFriend))
                } else if(addStatus.errors) {
                    message.error(addStatus.errors[0]);
                }
            } else {
                message.warning("Sign in to add friends");
            }
        })()
    };

    const newChat: Function = (e: UserType) => {
        if (!user.name) {
            message.warning("Sign in to message");
            return;
        };
        dispatch(setInterlocutor(e));
        router.push("/myMessages");
    };

    useEffect(() => {
        setEmptyText(friends ? "No Friends Found" : "No Users Found")
    }, [users]);

    return (
        <ConfigProvider renderEmpty={() => (
            <div className={styles.empty_cont}>
                <RiUserSearchFill className={styles.empty_icon}/>
                <p className={styles.empty_text}>{emptyText}</p>
            </div>
        )}>
            <List
                itemLayout="horizontal"
                dataSource={users}
                className={styles.list}
                renderItem={(item) => (
                    <List.Item
                        onClick={() => newChat(item)}
                        className={styles.list_item}
                    >
                        <Badge dot={item.active ? true : false}>
                            <Avatar src={item.image}/>
                        </Badge>
                        <div>
                            <Typography>{item.name}</Typography>
                            {!item.active && <Typography className="list_item_date">{item.lastVisited}</Typography>}
                        </div>
                        {!friends && user.name ?
                            <a className={styles.list_item_action} onClick={(e) => addFriend(item.id, e)}>Add
                                Friend</a> : accept ?
                                <a className={styles.list_item_action} ref={acceptLink}
                                   onClick={(e) => acceptRequest(item, e)}>Accept</a> : user.sentRequests.includes(item.id) ? <p> Request sent</p> : null}
                    </List.Item>
                )}
            />
        </ConfigProvider>
    )
}

export default UsersMapper;