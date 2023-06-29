import React, { useCallback, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";

import styles from "../../../../styles/Parts/MessagesChat/AudioMessage/AudioMessage.module.scss";
import { AudioMessageProps } from "../../../../types/propTypes";
import handleGQLRequest from "../../../../request/handleGQLRequest";
import Loading from "../../../Custom/Loading/Loading";

const AudioMessage = ({audioId, thisUser}:AudioMessageProps) => {
    const [listeningStatus, setListeningStatus] = useState<boolean>(false);
    const [audioData, setAudioData] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleVoiceMessage = useCallback(async () => {
        setLoading(true);
        const data = await handleGQLRequest("GetAudio", {audioId});
        setListeningStatus(true);
        setAudioData(data?.GetAudio?.data);
        setLoading(false);
    }, [setLoading, setListeningStatus, setAudioData, handleGQLRequest]);

    return (
       <div 
         className={styles.audio_cont}
         style={thisUser ? {
             borderBottomRightRadius: 0
          } : {
              borderTopLeftRadius: 0
          }}
         onClick={handleVoiceMessage}>
          {loading ? <Loading /> : listeningStatus ?
            <audio 
              src={audioData}
              controls
              autoPlay
              preload="auto" 
              className={styles.audio_player} /> 
              :
            <>
              <AiFillPlayCircle  className={styles.audio_message_icon}/>
              <p className={styles.audio_message_text}>
                 Voice Message
               </p>
            </>           
          }
       </div>
    )
};

export default AudioMessage;