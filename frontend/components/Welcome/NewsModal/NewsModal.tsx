import React from "react";

import styles from "../../../styles/Welcome/Welcome.module.scss";
import { NewsModalProps} from "../../../types/types";
import {CloseCircleFilled} from "@ant-design/icons";

const NewsModal:React.FC<NewsModalProps> = ({ news, toggleModal}) => {
    return (
        <div className={styles.welcome_modal}>
           <div className={styles.welcome_modal_content}>
               <CloseCircleFilled className={styles.welcome_modal_close} onClick={() => toggleModal(false)}/>
              <h3 className={styles.welcome_modal_title}>
                  {news.title}
              </h3>
               <p className={styles.welcome_modal_desc}>
                   {news.description}
               </p>
           </div>
        </div>
    )
}

export default NewsModal;