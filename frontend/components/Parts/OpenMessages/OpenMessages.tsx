import { WechatFilled } from "@ant-design/icons"
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import styles from "../../../styles/Parts/OpenMessages.module.scss";

const OpenMessages:React.FC = () => {
     const router = useRouter();
     const [display, setDisplay] = useState(false);

    const openMessages:Function = () => {
      router.replace("/myMessages");
    };

    useEffect(() => {
        console.log(router.pathname);
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