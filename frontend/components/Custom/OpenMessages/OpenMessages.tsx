import { WechatFilled } from "@ant-design/icons"
import { message} from "antd/lib";
import { useRouter} from "next/router";
import React, { useEffect, useState } from "react";
import {useSelector} from "react-redux";

import styles from "../../../styles/Custom/OpenMessages.module.scss";
import {UserType} from "../../../types/types";
import {IRootState} from "../../../store/store";

const OpenMessages:React.FC = () => {
     const router:any = useRouter();
     const [display, setDisplay] = useState<Boolean>(false);
     const user:UserType = useSelector((state:IRootState) => state.user.user);
    const openMessages:Function = () => {
        if(!user.name) {
            message.warning("Sign in to message");
            return;
        }
      router.replace("/myMessages");
    };

    useEffect(() => {
        if (router.pathname == "/myMessages") {
           setDisplay(false)
        } else {
          setDisplay(true);
        }
    }, [router.pathname])

    return (
        <div>
          {display ?
           <WechatFilled 
             onClick={() => openMessages()} 
             className={styles.open_icon}/>
             : null}
        </div>
    )
}

export default OpenMessages;