import React, { useRef, useState, useCallback, useEffect, lazy, Suspense } from "react";
import data from '@emoji-mart/data';
import { SmileOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useOnClickOutside } from "usehooks-ts";
import { useDispatch, useSelector } from "react-redux";
const EmojiPicker = lazy(() => import("@emoji-mart/react"))

import styles from "../../../../styles/Parts/MessagesChat/MessagesInput/MessagesInput.module.scss";
import { IRootState } from "../../../../store/store";
import type { MessagesInputProps } from "../../../../types/propTypes";
import type { UserType } from "../../../../types/types";
import { setMessagesData } from "../../../../store/messagesSlice";

const { TextArea } = Input;

const MessagesInput: React.FC<MessagesInputProps> = ({setMessageData, isBlocked, interlocutor }:any) => {
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
        if(isBlocked) {
            return;
        };
        setSmileStatus(current => !current);
    }, [smileStatus, setSmileStatus, isBlocked]);

    const send = useCallback(() => {
        if(isBlocked) {
            return;
        }
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

     useEffect(() => {
       if (!isBlocked) {
          setSmileStatus(false);
       };
     }, [isBlocked]);

     useEffect(() => {
        setMessage("");
     }, [interlocutor]);
     
    return (
        <div className={styles.inputs_cont}>
            <TextArea
                value={message}
                disabled={isBlocked}
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
                <div 
                ref={emojiRef} 
                className={styles.emoji_cont}
                style={{
                    width: "280px" 
                }}>
                    <Suspense fallback={""}>
            x         <EmojiPicker
                        dynamicWidth
                        theme="dark"
                        data={data} 
                        onEmojiSelect={addEmoji}
                        />
                    </Suspense>
                </div> 
            }
        </div> 
    )
};

export default MessagesInput;