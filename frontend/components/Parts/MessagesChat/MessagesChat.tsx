import React, { useCallback, useMemo, useRef } from "react";
import { Avatar, Badge, Form, Typography, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { WechatFilled } from "@ant-design/icons";
import { MdOutlineFileDownload } from "react-icons/md"
import { useMediaQuery } from "react-responsive";

import styles from "../../../styles/Parts/MessagesChat/MessagesChat.module.scss";
import { IRootState } from "../../../store/store";
import { MessagesDataType, UserType } from "../../../types/types";
import { getFilesOriginalName, getSendersId, getSlicedWithDots } from "../../../functions/functions";
import { setInterlocutorMessages, setMessagesData as setStoreMesaagesData } from "../../../store/messagesSlice";
import MessagesInput from "./MessagesInput/MessagesInput";
import UserDropdown from "../../Custom/UserDropdown/UserDropdown";
import handleGQLRequest from "../../../request/handleGQLRequest";

const getMessagesWithFiles = (messages: any[]) => {
    const newData = messages?.map((msg: string) => {
        if (msg?.startsWith("...(file)...")) {
            const fileName = msg.slice(12, msg.indexOf("&&"));
            let originalFileName = getFilesOriginalName(fileName);
            let message = msg.slice(msg.indexOf("&&") + 2);
            message = message.slice(message.indexOf("&&") + 2);
            return {
                fileName,
                originalFileName,
                message
            };
        }
        return msg;
    });
    return newData;
};

const MessagesChat: React.FC = () => {
    const [messageData, setMessageData] = useState<any>({ between: [], messages: [], sequence: [] });
    const [interlocutor, setInterlocutor] = useState<UserType>({} as UserType)

    const isMedium = useMediaQuery({ query: "(max-width: 750px)" });
    const isSmall: boolean = useMediaQuery({ query: "(max-width: 500px)" });
    const messagesRef = useRef<any>(null);

    const dispatch = useDispatch();
    const storeInterlocutor = useSelector((state: IRootState) => {
        return state.messages.interlocutor;
    });
    const socket = useSelector((state: IRootState) => {
        return state.socket.socket;
    });
    const storeUser: UserType = useSelector((state: IRootState) => {
        return state.user.user;
    });
    const [user, setUser] = useState<UserType>(storeUser);
    const router: any = useRouter();
    const isBlocked: boolean = useMemo(() => Boolean(messageData.blocked || user.blockedUsers?.includes(interlocutor.id)), [messageData, user.blockedUsers]);
    const isRequested: boolean = useMemo(() => Boolean(user.sentRequests?.includes(interlocutor.id) || user.friendRequests?.includes(interlocutor.id)), [user.sentRequests, interlocutor]);
    const isFriend: boolean = useMemo(() => Boolean(user.friends?.includes(interlocutor.id)), [interlocutor, user.friends]);

    const downloadFile = useCallback(async (filename: string) => {
        let file = await handleGQLRequest("GetFile", { name: filename });
        file = file.GetFile;
        let link = document.createElement('a');
        link.setAttribute('href', file.data);
        link.setAttribute('download', file.originalName);
        let event = new MouseEvent('click');
        link.dispatchEvent(event);
    }, [handleGQLRequest]);

    useEffect(() => {
        if (!user.name) {
            router.replace("/");
        } else {
            setInterlocutor({} as UserType);
        }
    }, [user])

    useEffect(() => {
        setInterlocutor(storeInterlocutor);
    }, [storeInterlocutor]);

    useEffect(() => {
        setMessageData({ between: [], messages: [], sequence: [] });
        if (socket) {
            socket.emit("getMessages", { interlocuters: [user.id, interlocutor.id] }, (res: any) => {
                const messages = getMessagesWithFiles(res.messages)
                setMessageData({
                    ...res,
                    messages
                });
            })
            socket.on("message", async (data: MessagesDataType) => {
                const senderId = getSendersId(data?.between, user.id);
                if (senderId == interlocutor.id) {
                    const messages = getMessagesWithFiles(data.messages);
                    setMessageData({
                        ...data,
                        messages
                    });
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
        if (interlocutor?.name) {
            if (socket) {
                socket.emit("newInterlocutor", { id: user.id, userId: storeInterlocutor.id }, (resp: any) => {
                    dispatch(setInterlocutorMessages(resp));
                });
            }
        }
    }, [interlocutor])

    useEffect(() => {
        setUser(storeUser);
    }, [storeUser]);

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
                                user={interlocutor} />
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
                                {messageData.blockedBy === messageData.between.indexOf(user.id) ? "Blocked by you" : "You were blocked"}
                            </div>}
                        {/* maping the messages  */}
                        {messageData.messages &&
                            messageData.messages?.map((msg: any, index: number) => {
                                const order: number = messageData.between.indexOf(user.id);
                                return (
                                    <div
                                        key={index}
                                        className={styles.message_cont}
                                        style={{
                                            justifyContent: messageData.sequence[index] == order ? "flex-end" : "flex-start",
                                        }}>
                                        <div
                                            className={styles.message_cont_data}
                                        >
                                            {msg?.fileName ? msg.message ? <div className={styles.message_cont_data_text_cont}>
                                                {msg?.message}
                                            </div> : "" : msg ? <div className={styles.message_cont_data_text_cont}>
                                                {msg}
                                            </div> : ""}
                                            {msg?.fileName &&
                                                <div className={styles.message_cont_data_file_cont}
                                                    onClick={() => downloadFile(msg.fileName)}>

                                                    <MdOutlineFileDownload className={styles.message_cont_file_cont_icon} />
                                                    {msg?.originalFileName || ""}
                                                </div>}
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                    <MessagesInput
                        setMessageData={(data: any) => setMessageData({
                            ...data,
                            messages: getMessagesWithFiles(data.messages)
                        })}
                        isBlocked={isBlocked}
                        interlocutor={interlocutor} />
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