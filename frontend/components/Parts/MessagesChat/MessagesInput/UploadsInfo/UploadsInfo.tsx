import React from "react";
import { RiAttachment2, RiDeleteBack2Fill } from "react-icons/ri";

import styles from "../../../../../styles/Parts/MessagesChat/MessagesInput/UploadsInfo/UploadsInfo.module.scss";
import { downloadBase64File, getSlicedWithDots } from "../../../../../functions/functions";
import { UploadsProps } from "../../../../../types/propTypes";

const UploadsInfo = ({file, audio, setAudio, setFile}:UploadsProps) => {
   return (
    <div 
      className={styles.uploads_cont}
      style={{
        height: (file && audio) ? "50px" : "25px",
        top: (file && audio) ? "-50px" : "-25px",
      }}>
        {file && <div className={styles.file_cont}>
         <div 
          className={styles.file_data_cont}
          onClick={() => downloadBase64File(file?.name, file?.url)}
          >
            <RiAttachment2 
               className={styles.file_icon}
             /> 
              {getSlicedWithDots(file?.name, 20)}
            </div>
            <RiDeleteBack2Fill 
               className={styles.delete_icon}
               onClick={() => setFile("")}
            />
        </div>}
       {audio && <div className={styles.audio_cont}>
           <audio  
             src={audio} 
             className={styles.audio_player} 
             controls />
              <RiDeleteBack2Fill 
               className={styles.delete_icon}
               onClick={() => setAudio("")}
            />
        </div>}
    </div>
   )
}

export default UploadsInfo;