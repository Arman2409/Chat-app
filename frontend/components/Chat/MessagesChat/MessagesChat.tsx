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

const {TextArea} = Input;

const MessagesChat: React.FC = () => {
    const [smileStatus, setSmileStatus] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [ messageData, setMessageData] = useState<any>({between: [], messages: []});
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

        console.log(user.id, interlocutor.id)
        socket.emit("message", {from: user.id, to: interlocutor.id,  message}, (data:any ) => {
            if(data.between){
                setMessageData(data);
            }
        });

        socket.on("message", (data:any) => {

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
            {interlocutor.name ?
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
                     {messageData.messages.map((e:string) => <p>{e}</p>)}
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