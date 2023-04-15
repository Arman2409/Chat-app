import { WechatFilled } from "@ant-design/icons"
import { message} from "antd/lib";
import { useRouter} from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector} from "react-redux";

import styles from "../../../styles/Custom/OpenMessages.module.scss";
import {UserType} from "../../../types/types";
import {IRootState} from "../../../store/store";
import useOpenAlert from "../../Tools/hooks/useOpenAlert";

const OpenMessages:React.FC = () => {
     const router:any = useRouter();
     const [display, setDisplay] = useState<Boolean>(false);
    const user:UserType = useSelector((state:IRootState) => state.user.user);
    const {setMessageOptions} = useOpenAlert();

    const openMessages:Function = () => {
        if(!user.name) {
            message.config({
                duration: 500
            })
            
            setMessageOptions({
              message: "Sign in to message", 
              type: "warning"});
            return;
        }
      router.replace("/myMessages");
    };

    useEffect(() => {
        if (router.pathname == "/myMessages" || router.pathname == "/404") {
           setDisplay(false)
        } else {
          setDisplay(true);
        }
    }, [router.pathname])

    return (
        <div>
          {display &&
           <div className={styles.open_cont}>
            <WechatFilled 
              onClick={() => openMessages()} 
              className={styles.open_cont_icon}/>
            </div>}
        </div>
    )
}

export default OpenMessages;