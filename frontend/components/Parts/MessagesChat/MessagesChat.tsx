import React, { useRef } from "react";
import { Avatar, Badge, Typography } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { WechatFilled } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

import styles from "../../../styles/Parts/MessagesChat/MessagesChat.module.scss";
import { IRootState } from "../../../store/store";
import { MessagesDataType, UserType } from "../../../types/types";
import { getSendersId, getSlicedWithDots } from "../../../functions/functions";
import { setInterlocutorMessages, setMessagesData as setStoreMesaagesData } from "../../../store/messagesSlice";
import MessagesInput from "./MessagesInput/MessagesInput";
import UserDropdown from "../../Custom/UserDropdown/UserDropdown";

const MessagesChat: React.FC = () => {
    const [messageData, setMessageData] = useState<any>({ between: [], messages: [], sequence: [] });
    const [interlocutor, setInterlocutor] = useState<UserType>({} as UserType)

    const isMedium = useMediaQuery({query: "(max-width: 750px)"});
    const isSmall: boolean = useMediaQuery({ query: "(max-width: 500px)" });
    const messagesRef = useRef<any>(null);

    const dispatch = useDispatch();
    const storeUser: UserType = useSelector((state: IRootState) => {
        return state.user.user;
    });
    const [user, setUser] = useState<UserType>(storeUser);
    const isBlocked = user.blockedUsers?.includes(interlocutor.id);
    const isRequested = user.sentRequests?.includes(interlocutor.id) ||  user.friendRequests?.includes(interlocutor.id);
    const isFriend = user.friends?.includes(interlocutor.id);
    
    const storeInterlocutor = useSelector((state: IRootState) => {
        return state.messages.interlocutor;
    });
    const socket = useSelector((state: IRootState) => {
        return state.socket.socket;
    });
    const router: any = useRouter();

    useEffect(() => {
        if (!user.name) {
            router.replace("/");
        } else {
            setInterlocutor({} as UserType);
        }
    }, [user])

    useEffect(() => { 
        setInterlocutor(storeInterlocutor);
        if(storeInterlocutor?.name) {
            if (socket) {
                socket.emit("newInterlocutor", {id:user.id, userId: storeInterlocutor.id}, (resp:any) => {
                  dispatch(setInterlocutorMessages(resp));
                });
            }
        }
    }, [storeInterlocutor]);

    useEffect(() => {
        setMessageData({ between: [], messages: [], sequence: [] });
        if (socket) {
            socket.emit("getMessages", { interlocuters: [user.id, interlocutor.id] }, (res: any) => {
                setMessageData(res);
            })
            socket.on("message", (data: MessagesDataType) => {
                const senderId = getSendersId(data?.between, user.id);
                if (senderId == interlocutor.id) {
                    setMessageData(data);
                    return;
                }
                dispatch(setStoreMesaagesData(data));
            })
        }
        setInterlocutor(storeInterlocutor);   
    }, [interlocutor, socket])

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messageData]);

    useEffect(() => {
        setUser(storeUser);
    }, [storeUser])

    return (
            <div className={styles.chat_cont}
              style={{
                width: isSmall ? "100%" : isMedium ? "42%" : "50%",
              }}>
                {interlocutor.name ?
                    <>
                        <div className={styles.interlocutor_cont}>
                            <div>
                           <UserDropdown 
                             type={isFriend ? "friend" : "all"} 
                             isRequested={isRequested}
                             isBlocked={isBlocked}  
                             user={interlocutor}/>
                             </div>
                             {/* interlocutor data  */}
                            <div className={styles.interlocutor_cont_name}>
                                <h5 className={styles.interlocutor_name}>
                                    {interlocutor.name ?
                                        interlocutor.name.length < 15 ? interlocutor.name : getSlicedWithDots(interlocutor.name, 15)
                                        : ""}
                                </h5>
                                <Badge dot={interlocutor.active ? true : false}>
                                      <Avatar 
                                         className={styles.interlocutor_avatar} 
                                         src={interlocutor.image} />
                                 </Badge>
                            </div>
                        </div>
                        <div className={styles.messages_cont} ref={messagesRef}>
                            {/* add blocked alert  */}
                            {messageData.blocked && 
                            <div className={styles.blocked_cont}>
                                 {messageData.blockedBy ===  messageData.between.indexOf(user.id) ? "Blocked by you" : "You were blocked"}
                            </div> }
                             {/* maping the messages  */}
                            {messageData.messages &&
                             messageData.messages?.map((e: string, index: number) => {
                                const order: number = messageData.between.indexOf(user.id);
                                return (
                                    <div
                                        key={index}
                                        className={styles.message_cont}
                                        style={{
                                            justifyContent: messageData.sequence[index] == order ? "flex-end" : "flex-start",
                                        }}>
                                        <div className={styles.message_cont_text_cont}>
                                            {e}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <MessagesInput setMessageData={setMessageData} interlocutor={interlocutor} />
                    </>
                    :
                    <div className={styles.choose_interlocutor_cont}>
                        <WechatFilled className={styles.choose_interlocutor_icon} />
                        <Typography className={styles.choose_interlocutor}>
                            Choose your interlocutor and start messaging
                        </Typography>
                    </div>
                }
            </div>
    )
};

export default MessagesChat;