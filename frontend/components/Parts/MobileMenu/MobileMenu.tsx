import React, { useCallback, useEffect, useState } from "react";
import { Dropdown } from "antd";
import { HiOutlineMenuAlt4 } from "react-icons/hi"
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import styles from "../../../styles/Parts/MobileMenu.module.scss";
import { setMenuOption } from "../../../store/windowSlice";
import items from "./items";

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
           <div className={styles.menu_cont_icon}>
             <HiOutlineMenuAlt4 />
           </div>
         </div>
       </Dropdown>
    )
}

export default MobileMenu;