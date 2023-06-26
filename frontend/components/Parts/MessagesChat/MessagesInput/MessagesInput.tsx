import React, { useRef, useState, useCallback, useEffect, lazy, Suspense } from "react";
import data from '@emoji-mart/data';
import { FaMicrophoneAlt } from "react-icons/fa";
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
import VoiceRecorder from "./VoiceRecorder/VoiceRecorder";
const UploadsInfo = lazy(() => import("./UploadsInfo/UploadsInfo"));

const { TextArea } = Input;

const MessagesInput: React.FC<MessagesInputProps> = ({ setMessageData, isBlocked, interlocutor }: any) => {
    const [smileStatus, setSmileStatus] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [file, setFile] = useState<any>();
    const [isRecordMode, setIsRecordMode] = useState(false);
    const [audio, setAudio] = useState<any>("");
    const dispatch = useDispatch();

    const emojiRef = useRef<any>(null);
    const smileRef = useRef<any>(null);

    const socket = useSelector((state: IRootState) => {
        return state.socket.socket;
    });

    const user: UserType = useSelector((state: IRootState) => {
        return state.user.user;
    });

    const addEmoji = useCallback((emoji: any) => {
        setMessage(curr => curr + emoji?.native);
    }, [setMessage]);

    const openEmojis = useCallback(() => {
        if (isBlocked) {
            return;
        };
        setSmileStatus(current => !current);
    }, [smileStatus, setSmileStatus, isBlocked]);

    const send = useCallback(async () => {
        if (isBlocked) {
            return;
        }
        if (!message && !file && !audio) {
            return;
        };
        let uploadFile;
        let originalFile;
        let audioId;
        // checking for uploaded file
        if (file) {
            const { url, type, name } = file;
            const getUploadFile = await handleGQLRequest("UploadFile", { base: url, name, type });
            uploadFile = getUploadFile?.UploadFile?.name;
            originalFile = getUploadFile?.UploadFile?.originalName;
        }
        // checking for uploaded audio
        
        if (audio) {
          const getUploadAudio = await handleGQLRequest("UploadAudio", {base: audio});
          audioId = getUploadAudio?.UploadAudio?.id;
        }
        socket.emit("message", { 
              from: user.id,
              to: interlocutor.id,
              message,
              file: uploadFile,
              orgFile: originalFile,
              audio: audioId}, (data: any) => {
            if (data.between) {
                setMessageData(data);
                setMessage("");
                dispatch(setMessagesData(data));
                setFile("");
                setAudio("");
            };
        });
    }, [message, file, audio, socket, setMessageData, user, interlocutor]);

    const changeFile = useCallback((info: any) => {
        const lastFile: any = last(info.fileList);
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

    useOnClickOutside(emojiRef, (e) => {
        if (smileStatus) {
            if (e.target == smileRef.current || smileRef.current.contains(e.target)) {
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
            <UploadsInfo 
              audio={audio}
              file={file}
              setFile={setFile}
              setAudio={setAudio}
              />     
            {isRecordMode ?
              <VoiceRecorder 
                setAudioData={setAudio}
                setIsRecordMode={setIsRecordMode}
               /> 
               :
               <TextArea
                value={message}
                disabled={isBlocked}
                className={styles.chat_textarea}
                onChange={(e: any) => setMessage(e.target.value)}
               />
               }
            <Form >
                <Form.Item className={styles.upload_form_item}>
                    <Upload
                        name="avatar"
                        fileList={[]}
                        onChange={changeFile}
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
            {!isRecordMode && 
                <FaMicrophoneAlt 
                 className={styles.record_icon}
                 onClick={() => setIsRecordMode(true)}/>
            }
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