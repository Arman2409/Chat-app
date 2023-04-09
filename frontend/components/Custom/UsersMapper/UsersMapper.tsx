import {List, Avatar, Typography, Badge, message, ConfigProvider, Button} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {RiUserSearchFill} from "react-icons/ri";
import {TbListSearch} from "react-icons/tb";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";

import styles from "../../../styles/Custom/UsersMapper.module.scss";
import {MapperProps} from "../../../types/types";
import handleGQLRequest from "../../../requests/handleGQLRequest";
import {IRootState} from "../../../store/store";
import useOpenAlert from "../../../hooks/useOpenAlert";
import {UserType} from "../../../types/types";
import {setInterlocutor} from "../../../store/messagesSlice";
import {setStoreUser} from "../../../store/userSlice";

const UsersMapper: React.FC<MapperProps> = ({friends, friendRequests, lastMessages, users,  accept}: MapperProps) => {    
    const [emptyText, setEmptyText] = useState<string>("");
    const router: any = useRouter();
    const dispatch: Dispatch = useDispatch();
    const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false);

    const user = useSelector((state: IRootState) => {
        return state.user.user
    })
    const acceptLink = useRef<null | any>(null);

    const { setMessageOptions } = useOpenAlert();

    const acceptRequest: Function = async (item: any, e: Event) => {
        e.stopPropagation();
        setButtonsDisabled(true);
        accept ? await accept(item.id) : null;
    }

    const addFriend: Function = (id: string, event: Event) => {
        event.stopPropagation();
        setButtonsDisabled(true);
        (async function () {
            if (user.email) {
                const addStatus = await handleGQLRequest("AddFriend", {id});    
                if(addStatus.message) {
                    setMessageOptions({
                        message: addStatus.message,
                        type: "error"
                    });
                }
                if (addStatus?.AddFriend?.email) {
                    setMessageOptions({
                        message: "Request Sent",
                        type: "success"
                    });
                    dispatch(setStoreUser(addStatus.AddFriend));
                } else if(addStatus.errors) {
                    setMessageOptions({
                        message: addStatus.errors[0],
                        type: "error"
                    });
                }
            } else {
                setMessageOptions({
                    message: "Sign in to add friends",
                    type: "warning"
                });
            }
        })()
    };

    const newChat: Function = (e: UserType) => {
        if (!user.name) {
            setMessageOptions({
                message: "Sign in to message",
                type: "warning"
            });
            return;
        };
        dispatch(setInterlocutor(e));
        router.push("/myMessages");
    };

    useEffect(() => {
        setEmptyText(friends ? "No Friends Found" : lastMessages ? "No Messages Found" : "No Users Found");
        setButtonsDisabled(false);
    }, [users]);

    return (
        <ConfigProvider renderEmpty={() => (
            <div className={styles.empty_cont}>
                {lastMessages ? <TbListSearch className={styles.empty_icon}/> : <RiUserSearchFill className={styles.empty_icon}/>}
                <p className={styles.empty_text}>{emptyText}</p>
            </div>
        )}>
            <List
                itemLayout="horizontal"
                dataSource={users}
                className={styles.list}
                renderItem={(item) => {
                    if(!friendRequests && user?.friendRequests?.includes(item.id)) return <></>;
                    return (
                    <List.Item
                        onClick={() => newChat(item)}
                        className={lastMessages ? styles.list_item_message : styles.list_item}
                    >
                        <Badge dot={item.active ? true : false}>
                            <Avatar src={item.image}/>
                        </Badge>
                        <div>
                            <Typography>{item.name}</Typography>
                            {!item.active && <Typography className="list_item_date">{item?.lastVisited}</Typography>}
                        </div>
                        {(!friends && user.name) ? lastMessages ? <p className={styles.list_item_action_message}>{item.lastMessage}</p> : user.sentRequests?.includes(item.id) ? 
                        <a className={styles.list_item_action_disabled} onClick={() => {}}>Request Sent</a> :
                            <Button disabled={buttonsDisabled} className={styles.list_item_action} onClick={(e) => addFriend(item.id, e)}>Add
                                Friend</Button> : accept ?
                                <Button className={styles.list_item_action} disabled={buttonsDisabled} ref={acceptLink}
                                   onClick={(e) => acceptRequest(item, e)}>Accept</Button> : ""}
                    </List.Item>
                )}}
            />
        </ConfigProvider>
    )
}

export default UsersMapper;