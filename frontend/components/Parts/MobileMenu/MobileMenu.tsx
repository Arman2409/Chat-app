import React, { useCallback, useEffect, useState } from "react";
import { Dropdown } from "antd";
import { BiMenuAltRight } from "react-icons/bi"

import styles from "../../../styles/Parts/MobileMenu.module.scss";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setMenuOption } from "../../../store/windowSlice";

const items = {
    mainItems:[
        {
            label: "News",
            key: "news"
        },
        {
            label: "Find User",
            key: "findUser"
        }
    ],
    messagesItems: [
        {
            label: "Last Messages",
            key: "lastMessages",
        },
        {
            label: "Chat",
            key: "chat"
        }
    ]
} 


const MobileMenu = () => {
    const [currentItems, setCurrentItems] = useState<any[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
    const router = useRouter();
    const dispatch = useDispatch();

    const handleSelect = useCallback((clicked:any) => {
       if(clicked.key) {
         dispatch(setMenuOption(clicked.key));
         setSelectedKeys([clicked.key]);
       }
    }, []);

    useEffect(() => {
      if (router.pathname === "/myMessages") {
        setCurrentItems(items.messagesItems);
      } else if (router.pathname === "/") {
        setCurrentItems(items.mainItems);
      };
      return () => {
        dispatch(setMenuOption(""))
      };
    }, [router.pathname])

    return (
       <Dropdown 
        trigger={["click"]}
        overlayClassName={styles.menu_cont_overlay} 
        menu={{
           selectedKeys: selectedKeys,
           onClick: (clicked) =>  handleSelect(clicked),
           items: currentItems }}
        >
         <div className={styles.menu_cont}>
           <BiMenuAltRight />
         </div>
       </Dropdown>
    )
}

export default MobileMenu;