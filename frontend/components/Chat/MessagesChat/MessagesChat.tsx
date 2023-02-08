import React from "react";
import {SmileOutlined} from "@ant-design/icons";
import {Input, Button, Avatar, Typography} from "antd";
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {WechatFilled} from "@ant-design/icons";

import messagesStyles from "../../../styles/Chat/MessagesChat/MessagesChat.module.scss";
import {IRootState} from "../../../store/store";
import {UserType} from "../../../types/types";
import {socket} from "../../../pages/_app";
import {getSlicedWithDots} from "../../../functions/functions";

const {TextArea} = Input;

const MessagesChat: React.FC = () => {
    const [smileStatus, setSmileStatus] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [messageData, setMessageData] = useState<any>({between: [], messages: [], sequence: []});
    const [interlocutor, setInterlocutor] = useState<UserType>({
        id: 0,
        name: "",
        email: "",
        image: "",
        friendRequests: [],
        friends: [],
        active: false
    })

    const router: any = useRouter();
    const user = useSelector((state: IRootState) => {
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
                console.log(data);
                console.log(socket.id);
                setMessageData(data);
            }
        });
    }

    useEffect(() => {
        if (!user.name) {
            router.replace("/");
        }
    }, [user])

    useEffect(() => {
        socket.on("message", (data: any) => {
            console.log({gotData: data});
            setMessageData(data);
        })
    }, [])

    useEffect(() => {
        setInterlocutor(storeInterlocutor);
    }, [storeInterlocutor]);

    useEffect(() => {
        setMessageData({between: [], messages: [], sequence: []});
    }, [interlocutor])

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
                    {messageData.messages.map((e: string, index: number) => {
                        const order:number = messageData.between.indexOf(Number(user.id));
                        console.log({index, order }, messageData.sequence);
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