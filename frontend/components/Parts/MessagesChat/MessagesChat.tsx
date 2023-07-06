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
import { downloadBase64File, getSendersId, getSlicedWithDots } from "../../../functions/functions";
import { setInterlocutorMessages, setMessagesData as setStoreMesaagesData } from "../../../store/messagesSlice";
import MessagesInput from "./MessagesInput/MessagesInput";
import UserDropdown from "../../Custom/UserDropdown/UserDropdown";
import handleGQLRequest from "../../../request/handleGQLRequest";
import AudioMessage from "./AudioMessage/AudioMessage";

const getCurrentTimeStamp = (messagedDate: string) => {
    const currentDate = new Date().toString().slice(3, 21);
    let displayDate:string = messagedDate.slice(13);
    const currentDayMonth = currentDate.slice(1,7);
    const messagedDayMonth  = messagedDate.slice(1,7);
    if(currentDayMonth !== messagedDayMonth) {
        displayDate = messagedDayMonth + " " + displayDate;
    }
    const currentYear = currentDate.slice(8,12);
    const messagedYear = messagedDate.slice(8,12);    
    if(currentYear !== messagedYear) {
        displayDate = messagedYear + " " + displayDate;
    };
    return displayDate;
}

const downloadFile = async (filename: string) => {
    let file = await handleGQLRequest("GetFile", { name: filename });
    downloadBase64File(file?.GetFile?.originalName, file?.GetFile?.data);
};

const MessagesChat: React.FC = () => {
    const [messageData, setMessageData] = useState<any>({ between: [], messages: [], sequence: [] });
    const [interlocutor, setInterlocutor] = useState<UserType>({} as UserType)
    const [isBlocked, setIsBlocked] = useState<boolean>(false);

    const isMedium = useMediaQuery({ query: "(max-width: 750px)" });
    const isSmall: boolean = useMediaQuery({ query: "(max-width: 600px)" });
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
    const [user, setUser] = useState<UserType>(storeUser as any);
    const router: any = useRouter();
    // const isBlocked = useState(() => Boolean(user.blockedUsers?.includes(interlocutor.id)), [user]);
    const isRequested: boolean = useMemo(() => Boolean(user.sentRequests?.includes(interlocutor.id) || user.friendRequests?.includes(interlocutor.id)), [user, interlocutor]);
    const isFriend: boolean = useMemo(() => Boolean(user.friends?.includes(interlocutor.id)), [interlocutor, user.friends]);

    console.log({
        // isBlocked,
        blockedUsers: user.blockedUsers,
        intelocutor: storeInterlocutor.id,
        currentId: user.id,
        includes: user.blockedUsers?.includes(interlocutor.id),
        isRequested,
        isFriend
    });
    

    useEffect(() => {
        if (!user.name) {
            router.replace("/");
        }
    }, [user])

    useEffect(() => {
        console.log({storeInterlocutor});

        setInterlocutor(storeInterlocutor);
    }, [storeInterlocutor]);

    useEffect(() => {
        setMessageData({ between: [], messages: [], sequence: [] });
        if (socket) {
            socket.emit("getInterlocutor", { currentId: user.id, userId: interlocutor.id }, (res: any) => {
                dispatch(setInterlocutorMessages({
                    ...res
                }));
                setMessageData({
                    ...res
                });
            })
            socket.on("message", async (data: MessagesDataType) => {
                const senderId = getSendersId(data?.between, user.id);
                if (senderId == interlocutor.id) {
                    setMessageData({
                        ...data
                    });
                    return;
                }
                dispatch(setStoreMesaagesData(data));
            })
        }
    }, [interlocutor, user.id, interlocutor.id,  socket])

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messageData]);

    useEffect(() => {
        console.log({storeUser});
        
        setUser(storeUser);
    }, [storeUser]);

    // useEffect(() => {
    //     console.log({storeInterlocutor});
        
    //   setInterlocutor(storeInterlocutor);
    // }, [storeInterlocutor])

    useEffect(() => {
        console.log({interlocutor});
        
    }, [interlocutor])

    useEffect(() => {
        //  console.log("is blocked", );
         setIsBlocked(Boolean(user.blockedUsers?.includes(interlocutor.id)));
         console.log("changed blocked ", Boolean(user.blockedUsers?.includes(interlocutor.id)));
         
    }, [user])

    return (
        <div className={styles.chat_cont}
            style={{
                width: isSmall ? "100%" : isMedium ? "42%" : "50%",
            }}>
            {interlocutor.name ?
                <>
                    <div className={styles.interlocutor_cont}>
                        {/* interlocutor data  */}
                        <div className={styles.interlocutor_cont_name}>
                            <Badge dot={interlocutor.active ? true : false}>
                                <Avatar
                                    className={styles.interlocutor_avatar}
                                    src={interlocutor.image} />
                            </Badge>
                            <h5 className={styles.interlocutor_name}>
                                {interlocutor.name ?
                                    interlocutor.name.length < 15 ? interlocutor.name : getSlicedWithDots(interlocutor.name, 15)
                                    : ""}
                            </h5>
                        </div>
                        <div>
                            <UserDropdown
                                type={isFriend ? "friend" : "all"}
                                isRequested={isRequested}
                                isBlocked={isBlocked}
                                openElement={interlocutor.email}
                                user={interlocutor} />
                        </div>
                    </div>
                    <div className={styles.messages_cont} ref={messagesRef}>
                        {/* add blocked alert  */}
                        {isBlocked &&
                            <div className={styles.blocked_cont}>
                                {messageData.blockedBy === messageData.between.indexOf(user.id) ? "Blocked by you" : "You were blocked"}
                            </div>}
                        {/* maping the messages  */}
                        {messageData.messages &&
                            messageData.messages?.map((msg: any, index: number) => {
                                const fromThisUser: boolean = msg.sentBy === messageData.between.indexOf(user.id);
                                const timeStamp = getCurrentTimeStamp(msg.date);
                                 
                                return (
                                    <div  key={index}>
                                    {msg.text && <div
                                        className={styles.message_cont}
                                        style={{
                                            justifyContent:fromThisUser  ? "flex-end" : "flex-start",
                                        }}>
                                            {fromThisUser && <p className={styles.messages_cont_date}>
                                                {timeStamp}
                                            </p>}
                                        <div
                                            className={`${styles.message_cont_data}`}
                                            style={fromThisUser ? {
                                                 borderBottomRightRadius: 0
                                                } : {
                                                    borderTopLeftRadius: 0
                                                }}
                                        >
                                            {msg.text ? 
                                                <div className={styles.message_cont_data_text_cont}>
                                                    {msg.text}
                                                </div> : "" }
                                        </div>
                                        {!fromThisUser && <p className={styles.messages_cont_date}>
                                                {timeStamp}
                                         </p>}
                                    </div>}
                                    {msg?.file && <div
                                        className={styles.message_cont}
                                        style={{
                                            justifyContent:fromThisUser  ? "flex-end" : "flex-start",
                                        }}
                                        >
                                            {fromThisUser && <p className={styles.messages_cont_date}>
                                                        {timeStamp}
                                                    </p>}
                                                <div className={styles.message_cont_data_file_cont}
                                                    style={fromThisUser ? {
                                                        borderBottomRightRadius: 0
                                                    } : {
                                                        borderTopLeftRadius: 0
                                                    }}
                                                    onClick={() => downloadFile(msg.file?.name)}>
                                                    <MdOutlineFileDownload className={styles.message_cont_data_file_cont_icon} />
                                                    {msg.file?.originalName || ""}
                                                </div>
                                                {!fromThisUser && <p className={styles.messages_cont_date}>
                                                {timeStamp}
                                         </p>}
                                    </div>}
                                        {msg?.audio && <div
                                            className={styles.message_cont}
                                            style={{
                                                justifyContent:fromThisUser  ? "flex-end" : "flex-start",
                                            }}>
                                            {fromThisUser && <p className={styles.messages_cont_date}>
                                                {timeStamp}
                                             </p>}
                                            <AudioMessage thisUser={fromThisUser} audioId={msg.audio} /> 
                                            {!fromThisUser && <p className={styles.messages_cont_date}>
                                                {timeStamp}
                                             </p>} 
                                        </div> }
                                    </div>
                                    
                                )
                            })}
                    </div>
                    <MessagesInput
                        setMessageData={setMessageData}
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