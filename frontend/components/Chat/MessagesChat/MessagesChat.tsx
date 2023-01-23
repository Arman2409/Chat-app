import React from "react";
import {SmileOutlined} from "@ant-design/icons";
import {Input, Button, Avatar} from "antd";
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";

import messagesStyles from "../../../styles/Chat/MessagesChat/MessagesChat.module.scss";
import {IRootState} from "../../../store/store";
import {io} from "socket.io-client";
import {UserType} from "../../../types/types";

const {TextArea} = Input;

export const socket = io("ws://localhost:4000");

const MessagesChat: React.FC = () => {
    const [smileStatus, setSmileStatus] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [interlocutor, setInterlocutor] = useState<UserType>({ id: 0 ,name: "", email: "", image:"", friendRequests: [], friends: [], active: false})

    const router: any = useRouter();
    const user = useSelector((state: IRootState) => {
        return state.user.user;
    });
    const storeInterlocutor = useSelector((state: IRootState) => {
        return state.messages.interlocutor;
    });

    const send = () => {
        if( !message) {
            return;
        }
        socket.emit("message", {from: user.id, to: interlocutor.id,  message}, (data:any ) => {
            if(data == "Send"){
                console.log("Send")
            }
        });

        socket.on("message", (data:any) => {
            console.log({data});
        })
    }

    useEffect(() => {
        if (!user.name) {
            router.replace("/");
        }
    }, [user])


    useEffect(() => {
      setInterlocutor(storeInterlocutor);
    }, [storeInterlocutor]);

    return (
        <div className={messagesStyles.chat_cont}>
            {interlocutor ?
                <>
                    <div style={{
                        width: "100%",
                        backgroundColor: "blue",
                        height: "auto",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        padding: 10
                    }}>
                        <h5>
                            {interlocutor.name || ""}
                        </h5>
                        <Avatar style={{
                            width: "50px",
                            height: "50px"
                        }} src={interlocutor.image} />
                    </div>
                    <div className={messagesStyles.inputs_cont}>
                        <TextArea
                           onChange={(e: any) => setMessage(e.target.value)}
                            className={messagesStyles.chat_textarea}
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
                : null}
        </div>
    )
};

export default MessagesChat;