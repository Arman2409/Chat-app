import React, {useRef} from "react";
import {SmileOutlined} from "@ant-design/icons";
import {Input, Button, Avatar, Typography} from "antd";
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {WechatFilled} from "@ant-design/icons";

import messagesStyles from "../../../styles/Chat/MessagesChat/MessagesChat.module.scss";
import {IRootState} from "../../../store/store";
import {MessagesDataType, UserType} from "../../../types/types";
import {socket} from "../../../pages/_app";
import {getSendersId, getSlicedWithDots} from "../../../functions/functions";
import {setMessagesData} from "../../../store/messagesSlice";

const {TextArea} = Input;

const MessagesChat: React.FC = () => {
    const [smileStatus, setSmileStatus] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [messageData, setMessageData] = useState<any>({between: [], messages: [], sequence: []});
    const dispatch = useDispatch();
    const [interlocutor, setInterlocutor] = useState<UserType>({
        id: 0,
        name: "",
        email: "",
        image: "",
        friendRequests: [],
        friends: [],
        active: false
    })

    const messagesRef = useRef<any>();

    const router: any = useRouter();
    const user:UserType = useSelector((state: IRootState) => {
        return state.user.user;
    });
    const storeInterlocutor = useSelector((state: IRootState) => {
        return state.messages.interlocutor;
    });

    const send = () => {
        if (!message) {
            return;
        }
        socket.emit("message", {from: user.id, to: interlocutor.id, message}, (data: any) => {
            if (data.between) {
                setMessageData(data);
            }
        });
        // setMessage("")
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
        setMessageData({between: [], messages: [], sequence: []});
    }, [interlocutor])

    useEffect(() => {
        socket.on("message", (data: MessagesDataType) => {
            setMessageData(data);
            const senderId = getSendersId(data.between, user.id);
            console.log(senderId , interlocutor.id)
            if(senderId == interlocutor.id) {
                console.log("same")
               return;
            }
            dispatch(setMessagesData(data));
        })
    },[]);

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
                        <Avatar style={{
                            width: "50px",
                            height: "50px"
                        }} src={interlocutor.image}/>
                    </div>
                    <div className={messagesStyles.messages_cont} ref={messagesRef}>
                    {messageData.messages.map((e: string, index: number) => {
                        const order:number = messageData.between.indexOf(Number(user.id));
                        return (
                            <div
                                key={index}
                                className={messagesStyles.message_cont}
                                style={{
                                    justifyContent: messageData.sequence[index] == order ? "flex-end" : "flex-start",
                                }}>
                                <div  className={messagesStyles.message_cont_text_cont}>
                                    {e}
                                </div>
                            </div>
                        )
                    })}
                    </div>
                    <div className={messagesStyles.inputs_cont}>
                        <TextArea
                            className={messagesStyles.chat_textarea}
                            onChange={(e: any) => setMessage(e.target.value)}
                        />
                        <SmileOutlined
                            size={50}
                            className={messagesStyles.smile_icon}
                            onClick={() => setSmileStatus(status => !status)}/>
                        <Button
                            type="primary"
                            className={messagesStyles.send_button}
                            onClick={send}
                        >
                            Send
                        </Button>
                        {smileStatus ?
                            <div className={messagesStyles.emoji_cont}>
                                <EmojiPicker
                                    searchDisabled
                                    height={"300px"}/>
                            </div> : null}
                    </div>
                </>
                :
                <div className={messagesStyles.choose_interlocutor_cont}>
                    <WechatFilled className={messagesStyles.choose_interlocutor_icon}/>
                    <Typography className={messagesStyles.choose_interlocutor}>
                        Choose your interlocutor and start messaging
                    </Typography>
                </div>
            }
        </div>
    )
};

export default MessagesChat;