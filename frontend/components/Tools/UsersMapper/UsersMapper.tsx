import {List, Avatar, Typography, Badge, Button} from "antd";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {RiUserSearchFill} from "react-icons/ri";
import {TbListSearch} from "react-icons/tb";
import { WaveLoading } from "react-loading-typescript";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";

import styles from "../../../styles/Tools/UsersMapper.module.scss";
import {MapperProps} from "../../../types/types";
import handleGQLRequest from "../../../request/handleGQLRequest";
import {IRootState} from "../../../store/store";
import useOpenAlert from "../hooks/useOpenAlert";
import {UserType} from "../../../types/types";
import {setInterlocutor} from "../../../store/messagesSlice";
import {setStoreUser} from "../../../store/userSlice";
import { getSlicedWithDots } from "../../../functions/functions";
import { usersLoadWaitTime } from "../../../configs/configs";
import { getEventListeners } from "events";

const UsersMapper: React.FC<MapperProps> = ({users, loadingSearch, newPage, getUsers = () => {}, total = 0,  friends, friendRequests, lastMessages,  accept}: MapperProps) => {    
    const [emptyText, setEmptyText] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [newType, setNewType] = useState(false);
    const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const gettingUsersRef = useRef(false);

    const router: any = useRouter();

    const dispatch: Dispatch = useDispatch();

    const user = useSelector((state: IRootState) => {
        return state.user.user
    });
    const storeInterlocutor = useSelector((state: IRootState) => {
        return state.messages.interlocutor;
    });

    const acceptLink = useRef<null | any>(null);
    const listRef = useRef<null | any>(null);

    const { setMessageOptions } = useOpenAlert();

    const acceptRequest: Function = async (item: any, e: Event) => {
        e.stopPropagation();
        setButtonsDisabled(true);
        accept ? await accept(item.id) : null;
    }

    const handleAddFriend: Function = (id: string, event: Event) => {
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

    const handleScroll = (e:any) => { 
        if (listRef.current?.contains(e.target) ||  listRef.current === e.target) {
            if(e.deltaY > 0){    
               if (listRef.current.scrollTop >= (listRef.current.scrollHeight - listRef.current.clientHeight)) {     
                if (loading) {
                    return;
                };
                if ( gettingUsersRef.current) {
                    return;
                }
                if (total <= users.length) {
                    return;
                };
                gettingUsersRef.current = true;
                 setLoading(true);
                 setPage(curr => {
                    
                    getUsers(curr + 1);
                    return curr + 1});
               }      
            };
        }
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
        setLoading(false);
        gettingUsersRef.current = false
    }, [users]);

    useEffect(() => {
        // const scrollCallback = (e:any) => {
        //     handleScroll(e);     
            // if (total <= users.length) {
            //     window.removeEventListener("wheel", scrollCallback);
            //     return;
            // };
        //    }
        //    console.log(window);
           if(loading) {
             window.removeEventListener("wheel", handleScroll, true);
           
           } else {
             window.addEventListener("wheel", handleScroll, true);
           }
           if(loading) {
            setTimeout(() => {
                if (loading) {
                    setLoading(false)
                }
            }, usersLoadWaitTime);
         }
    }, [loading]);

    useEffect(() => {
       setPage(1);
    }, [friends]);

    useEffect(() => {
       setPage(newPage as number)
    }, [newPage])

    useEffect(() => {
       setNewType(true);
       setPage(1);
    }, [friends]);

    return (
        <div ref={listRef}
            className={`${styles.list}`}
             >
                {users.length === 0 && !loading && !loadingSearch && !newType &&  <div className={styles.empty_cont}>
                    {lastMessages ? <TbListSearch className={styles.empty_icon}/> : <RiUserSearchFill className={styles.empty_icon}/>}
                    <p className={styles.empty_text}>{emptyText}</p>
                 </div>}
                 {users.length === 0 && newType &&  <WaveLoading {...{} as any} />}
                  {users.map((item) => {
                    if(!friendRequests && user?.friendRequests?.includes(item.id)) return <></>;
                    let isInterlocutor;
                    if(item.id === storeInterlocutor.id) isInterlocutor = true;
                    return (
                    <List.Item
                        onClick={() => newChat(item)}
                        className={lastMessages ? isInterlocutor ? styles.list_item_message_interlocutor : styles.list_item_message : styles.list_item}
                    >
                        <Badge dot={item.active ? true : false}>
                            <Avatar src={item.image}/>
                        </Badge>
                        <div>
                            <Typography>{item.name}</Typography>
                            {!item.active && <Typography className="list_item_date">{item?.lastVisited}</Typography>}
                        </div>
                        {(!friends && user.name) ? 
                        lastMessages ? <p className={styles.list_item_action_message}>{getSlicedWithDots(item.lastMessage,25)}{item.notSeenCount && <span style={{width: "5px", height: "5px", display: "block"}}>{item.notSeenCount}</span>}</p> : 
                         user.sentRequests?.includes(item.id) ?  <a className={styles.list_item_action_disabled} onClick={() => {}}>Request Sent</a> :
                            <Button loading={buttonsDisabled} className={styles.list_item_action} onClick={(e) => handleAddFriend(item.id, e)}>Add
                                Friend</Button> :
                                 accept ?  <Button 
                                  className={styles.list_item_action}
                                  loading={buttonsDisabled} ref={acceptLink}
                                   onClick={(e) => acceptRequest(item, e)}>Accept</Button> : ""}
                    </List.Item>
                    )
                })}
                {(loading || loadingSearch) && <div style={{position: "relative", paddingTop: "25px"}}>
                  <WaveLoading {...{} as any} />
                </div>}
        </div>
    )
}

export default UsersMapper;