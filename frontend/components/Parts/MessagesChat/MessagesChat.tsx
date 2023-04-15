import React, { useRef } from "react";
import { Avatar, Typography } from "antd";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { WechatFilled } from "@ant-design/icons";

import messagesStyles from "../../../styles/Chat/MessagesChat/MessagesChat.module.scss";
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
                console.log("get", data);    
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
        if(messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messageData]);

    return (
        <div className={messagesStyles.chat_cont}>
            {interlocutor.name ?
                <>
                    <div className={messagesStyles.interlocutor_cont}>
                        <h5 className={messagesStyles.interlocutor_name}>
                            {interlocutor.name ?
                                interlocutor.name.length < 15 ? interlocutor.name : getSlicedWithDots(interlocutor.name, 15)
                                : ""}
                        </h5>
                        <Avatar className={messagesStyles.interlocutor_avatar} src={interlocutor.image} />
                    </div>
                    <div className={messagesStyles.messages_cont} ref={messagesRef}>
                        {messageData.messages && messageData.messages?.map((e: string, index: number) => {
                            const order: number = messageData.between.indexOf(user.id);
                            return (
                                <div
                                    key={index}
                                    className={messagesStyles.message_cont}
                                    style={{
                                        justifyContent: messageData.sequence[index] == order ? "flex-end" : "flex-start",
                                    }}>
                                    <div className={messagesStyles.message_cont_text_cont}>
                                        {e}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <MessagesInput setMessageData={setMessageData} interlocutor={interlocutor} />
                 </>
                :
                <div className={messagesStyles.choose_interlocutor_cont}>
                    <WechatFilled className={messagesStyles.choose_interlocutor_icon} />
                    <Typography className={messagesStyles.choose_interlocutor}>
                        Choose your interlocutor and start messaging
                    </Typography>
                </div>
            }
        </div>
    )
};

export default MessagesChat;