import React, { useRef, useState, useCallback, useEffect, lazy, Suspense } from "react";
import data from '@emoji-mart/data';
import { FileAddFilled, SmileOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload } from "antd";
import { useOnClickOutside } from "usehooks-ts";
import { useDispatch, useSelector } from "react-redux";
import { RcFile } from "antd/es/upload";
import { last } from "lodash";
const EmojiPicker = lazy(() => import("@emoji-mart/react"))

import styles from "../../../../styles/Parts/MessagesChat/MessagesInput/MessagesInput.module.scss";
import { IRootState } from "../../../../store/store";
import type { MessagesInputProps } from "../../../../types/propTypes";
import type { UserType } from "../../../../types/types";
import { setMessagesData } from "../../../../store/messagesSlice";
import { getBase64 } from "../../../../functions/functions";
import handleGQLRequest from "../../../../request/handleGQLRequest";

const { TextArea } = Input;

const MessagesInput: React.FC<MessagesInputProps> = ({setMessageData, isBlocked, interlocutor }:any) => {
    const [smileStatus, setSmileStatus] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [file, setFile] = useState<any>();
    const [fileList, setFileList] = useState<any[]>([]);
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

    const send = useCallback(async () => {
        if(isBlocked) {
            return;
        }
        if (!message && !file) {
            return;
        };
        let uploadFile;
        let originalFile;
        if(file) {
           const{ url, type, name} = file;
           const getUploadFile = await handleGQLRequest("UploadFile", {base: url, name, type});
              
           uploadFile = getUploadFile?.UploadFile?.name;
           originalFile = getUploadFile?.UploadFile?.originalName;
           setFileList([]);
           setFile("")
        }
        socket.emit("message", { from: user.id, to: interlocutor.id, message, file: uploadFile, orgFile: originalFile}, (data: any) => {
            if (data.between) {
                setMessageData(data);
                setMessage("");
                dispatch(setMessagesData(data));
            };
        });
    }, [message, file, socket, setMessageData, user, interlocutor]);

    const changeFile = useCallback((info:any) => {
        const lastFile:any = last(info.fileList);
        setFileList([lastFile]);
        if (lastFile) {
            getBase64(lastFile.originFileObj as RcFile, (url) => {
               setFile({
                 url,
                 name: lastFile.name,
                 type: lastFile.type
               });
            });
        }
    }, []);
     
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
             <Form >
                        <Form.Item className={styles.upload_form_item}>
                        <Upload 
                            onChange={changeFile}
                            name="avatar"
                            listType="text"
                            maxCount={1}
                            fileList={fileList}
                            onRemove={() => setFile("")}
                            className={styles.upload_button}
                            >
                               <FileAddFilled 
                                 className={styles.upload_icon}
                                 />              
                         </Upload>
                        </Form.Item>

                    </Form>
                   
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
                     <EmojiPicker
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