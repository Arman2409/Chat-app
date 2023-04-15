import React, { useRef, useState, useCallback } from "react";
import EmojiPicker from "emoji-picker-react";
import { SmileOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useOnClickOutside } from "usehooks-ts";
import { useSelector } from "react-redux";

import messagesStyles from "../../../../styles/Chat/MessagesChat/MessagesChat.module.scss";
import { IRootState } from "../../../../store/store";
import { UserType } from "../../../../types/types";

const { TextArea } = Input;

const MessagesInput = ({setMessageData, interlocutor }:any) => {
    const [smileStatus, setSmileStatus] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const emojiRef = useRef<any>(null);
    const smileRef = useRef<any>(null);

    const socket = useSelector((state: IRootState) => {
        return state.socket.socket;
    });

    const user: UserType = useSelector((state: IRootState) => {
        return state.user.user;
    });
    
    useOnClickOutside(emojiRef,(e) => {
        if(smileStatus) {
         if(e.target == smileRef.current || smileRef.current.contains(e.target)) {
             return;          
          };
          setSmileStatus(false);
        };       
     });

     const addEmoji = useCallback((emoji:any) => {
        setMessage(curr => curr + emoji?.emoji);        
    }, [setMessage]);

    const openEmojis = useCallback(() => {
        setSmileStatus(current => !current);
    }, [smileStatus, setSmileStatus]);

    const send = useCallback(() => {
        if (!message) {
            return;
        }
        socket.emit("message", { from: user.id, to: interlocutor.id, message }, (data: any) => {
            if (data.between) {
                setMessageData(data);
                setMessage("");
            }
        });
    }, [message, socket, setMessageData, user, interlocutor]);
     
    return (
        <div className={messagesStyles.inputs_cont}>
        <TextArea
            value={message}
            className={messagesStyles.chat_textarea}
            onChange={(e: any) => setMessage(e.target.value)}
        />
        <SmileOutlined
            ref={smileRef}
            size={50}
            className={messagesStyles.smile_icon}
            onClick={openEmojis} />
        <Button
            type="primary"
            className={messagesStyles.send_button}
            onClick={send}
        >
            Send
        </Button>
        {smileStatus ?
            <div ref={emojiRef} className={messagesStyles.emoji_cont}>
                <EmojiPicker
                    searchDisabled
                    onEmojiClick={(emoji) => addEmoji(emoji)}
                    height={"300px"} />
            </div> : null}
    </div>
    )
};

export default MessagesInput;