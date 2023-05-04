import React, { useRef, useState, useCallback } from "react";
import data from '@emoji-mart/data';
import EmojiPicker from "@emoji-mart/react";
import { SmileOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useOnClickOutside } from "usehooks-ts";
import { useDispatch, useSelector } from "react-redux";

import styles from "../../../../styles/Parts/MessagesChat/MessagesInput/MessagesInput.module.scss";
import { IRootState } from "../../../../store/store";
import { UserType } from "../../../../types/types";
import { setMessagesData } from "../../../../store/messagesSlice";

const { TextArea } = Input;

const MessagesInput = ({setMessageData, interlocutor }:any) => {
    const [smileStatus, setSmileStatus] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const dispatch = useDispatch();

    const emojiRef = useRef<any>(null);
    const smileRef = useRef<any>(null);

    const socket = useSelector((state: IRootState) => {
        return state.socket.socket;
    });

    const user: UserType = useSelector((state: IRootState) => {
        return state.user.user;
    });

     const addEmoji = useCallback((emoji:any) => {
        setMessage(curr => curr + emoji?.native);        
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
                dispatch(setMessagesData(data));
            }
        });
    }, [message, socket, setMessageData, user, interlocutor]);
     
    useOnClickOutside(emojiRef,(e) => {
        if(smileStatus) {
         if(e.target == smileRef.current || smileRef.current.contains(e.target)) {
             return;          
          };
          setSmileStatus(false);
        };       
     });
     
    return (
        <div className={styles.inputs_cont}>
        <TextArea
            value={message}
            className={styles.chat_textarea}
            onChange={(e: any) => setMessage(e.target.value)}
        />
        <SmileOutlined
            ref={smileRef}
            size={50}
            className={styles.smile_icon}
            onClick={openEmojis} />
        <Button
            type="primary"
            className={styles.send_button}
            onClick={send}
        >
            Send
        </Button>
         {smileStatus &&
             <div ref={emojiRef} className={styles.emoji_cont}>
                    <EmojiPicker
                      theme="dark"
                      data={data} 
                      onEmojiSelect={addEmoji}
                       />
             </div> 
         }
        </div> 
    )
};

export default MessagesInput;