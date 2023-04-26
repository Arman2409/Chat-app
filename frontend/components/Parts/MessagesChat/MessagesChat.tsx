import React, { useRef } from "react";
import { Avatar, Badge, Button, Typography } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { WechatFilled } from "@ant-design/icons";

import styles from "../../../styles/Parts/MessagesChat.module.scss";
import { IRootState } from "../../../store/store";
import { MessagesDataType, UserType } from "../../../types/types";
import { getSendersId, getSlicedWithDots } from "../../../functions/functions";
import { setMessagesData } from "../../../store/messagesSlice";
import MessagesInput from "./MessagesInput/MessagesInput";
import handleGQLRequest from "../../../request/handleGQLRequest";
import { setStoreUser } from "../../../store/userSlice";
import useOpenAlert from "../../Tools/hooks/useOpenAlert";

const MessagesChat: React.FC = () => {
    const [messageData, setMessageData] = useState<any>({ between: [], messages: [], sequence: [] });
    const [interlocutor, setInterlocutor] = useState<UserType>({} as UserType)
    const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
    const [requestSent, setRequestSent] = useState(false);

    const messagesRef = useRef<any>(null);

    const dispatch = useDispatch();
    const storeUser: UserType = useSelector((state: IRootState) => {
        return state.user.user;
    });
    const [user, setUser] = useState<UserType>(storeUser);
    const showAdd = !user.friends?.includes(interlocutor.id) && !user.sentRequests?.includes(interlocutor.id);
    const storeInterlocutor = useSelector((state: IRootState) => {
        return state.messages.interlocutor;
    });
    const socket = useSelector((state: IRootState) => {
        return state.socket.socket;
    });
    const router: any = useRouter();

    const { setMessageOptions } = useOpenAlert();


    const addFriend = () => {
        setLoadingAdd(true);
        (async function () {
            if (user.email) {
                const addStatus = await handleGQLRequest("AddFriend", {id: interlocutor.id});    
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
            setLoadingAdd(false);
            setRequestSent(true)
        })()
    }

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

    useEffect(() => {
        setUser(storeUser);
    }, [storeUser])

    return (
        <>
            <div className={styles.chat_cont}>
                {interlocutor.name ?
                    <>
                        <div className={styles.interlocutor_cont}>
                            <div>
                           {showAdd && !requestSent && 
                              <Button 
                                  onClick={() => addFriend()}
                                  className={styles.interlocutor_cont_add_friend}
                                  loading={loadingAdd}>
                                 Add Friend
                              </Button>}
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