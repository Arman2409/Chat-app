import React, { useCallback, useState } from "react";
import { AudioRecorder, IDataAvailable } from "@amirseifi/react-voice-recorder";
import { CloseOutlined } from "@ant-design/icons";
import "@amirseifi/react-voice-recorder/dist/style.css";

import styles from "../../../../../styles/Parts/MessagesChat/MessagesInput/VoiceRecorder/VoiceRecorder.module.scss";
import useOpenAlert from "../../../../Tools/hooks/useOpenAlert";
import { VoiceRecorderProps } from "../../../../../types/propTypes";

const VoiceRecorder = ({setAudioData, setIsRecordMode}:VoiceRecorderProps) => {
    const { setMessageOptions } = useOpenAlert();

    const onDataReady = useCallback((value: IDataAvailable) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target !== null) {
            setAudioData(event.target.result as string);
            setIsRecordMode(false);
          }
        }
        reader.readAsDataURL(value.value)
      }, [setAudioData, setIsRecordMode]);
  
      const onCancel = useCallback(() => {
        setAudioData("");
      }, [setAudioData])
    
      const onPermissionDenied = useCallback(() => {
        setMessageOptions({
          message: "Permission Denied",
          type: "warning"
        });
        setIsRecordMode(false);
      }, [setMessageOptions])

    return (
        <div className={"chat-control " + styles.chat_control}>
            <div className='chat-control-container'>
                <div className='voice-recorder'>
                         <div 
                           className={styles.recorder_close_cont_icon} 
                           onClick={() =>  setIsRecordMode(false)
                         }>
                            <CloseOutlined style={{fontSize: "10px", }}/>
                        </div>
                            <AudioRecorder
                                onCancel={onCancel}
                                onDataAvailable={onDataReady}
                                onPermissionDenied={onPermissionDenied}
                                isLogging
                            />
                </div>
            </div>
        </div>
    )
}

export default VoiceRecorder;