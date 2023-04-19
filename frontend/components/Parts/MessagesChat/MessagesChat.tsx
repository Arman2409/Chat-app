import React, { useRef } from "react";
import { Avatar, Typography } from "antd";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { WechatFilled } from "@ant-design/icons";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { FaUserFriends } from "react-icons/fa";

import styles from "../../../styles/Parts/MessagesChat.module.scss";
import { IRootState } from "../../../store/store";
import { MessagesDataType, UserType } from "../../../types/types";
import { getSendersId, getSlicedWithDots } from "../../../functions/functions";
import { setMessagesData } from "../../../store/messagesSlice";
import MessagesInput from "./MessagesInput/MessagesInput";

const MessagesChat: React.FC = () => {
    const [messageData, setMessageData] = useState<any>({ between: [], messages: [], sequence: [] });
    const [interlocutor, setInterlocutor] = useState<UserType>({} as UserType)
    const messagesRef = useRef<any>(null);

    const dispatch = useDispatch();
    const user: UserType = useSelector((state: IRootState) => {
        return state.user.user;
    });
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
        }
    }, [user])

    useEffect(() => { 
        setInterlocutor(storeInterlocutor);
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
                dispatch(setMessagesData(data));
            })
        }
        setInterlocutor(storeInterlocutor);
    }, [interlocutor, socket])

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messageData]);

    return (
        <>
            <div className={styles.chat_cont}>
                {interlocutor.name ?
                    <>
                        <div className={styles.interlocutor_cont}>
                            <div className={styles.interlocutor_cont_info}>
                                    <HiOutlineStatusOnline className={`${styles.interlocutor_cont_info_icon} ${interlocutor.active && styles.interlocutor_cont_info_active}`} />
                                    <FaUserFriends className={`${styles.interlocutor_cont_info_icon} ${user.friends?.includes(interlocutor.id) && styles.interlocutor_cont_info_active}`}/>
                                </div>
                            <div className={styles.interlocutor_cont_name}>
                                <h5 className={styles.interlocutor_name}>
                                    {interlocutor.name ?
                                        interlocutor.name.length < 15 ? interlocutor.name : getSlicedWithDots(interlocutor.name, 15)
                                        : ""}
                                </h5>
                                <Avatar className={styles.interlocutor_avatar} src={interlocutor.image} />
                            </div>
                        </div>
                        <div className={styles.messages_cont} ref={messagesRef}>
                            {messageData.messages && messageData.messages?.map((e: string, index: number) => {
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
        </>
    )
};

export default MessagesChat;