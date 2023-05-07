import Head from "next/head";
import React from "react";
import { Layout, Row } from "antd";
import {useRouter} from "next/router";
import {useEffect} from "react";
import { useSelector } from "react-redux";

import MessagesChat from "../components/Parts/MessagesChat/MessagesChat";
import LastMessages from "../components/Parts/LastMessages/LastMessages";
import { IRootState } from "../store/store";
import { useMediaQuery } from "react-responsive";

const { Content } = Layout;

const MyMessages:React.FC = () => {
    const router:any = useRouter();
    const menuOption = useSelector((state: IRootState) => {
      return state.window.menuOption;
  });

   const isSmall: boolean = useMediaQuery({ query: "(max-width: 500px)" });
  
    useEffect(() => {
        const signed = localStorage.getItem("token")
        if(!signed ) {
            router.replace(404);
        }
    }, []);

    return (
    <Content style={{
        height: "calc(100vh - 180px)",
     }}>
       <Head>
         <title>My Messages</title>
       </Head>
       <Row style={{
        height: "100%",
        border: "1px solid green"
       }}>
        {isSmall ?   menuOption === "chat" ?
         <MessagesChat /> : 
         <LastMessages /> : 
          <>
            <LastMessages />
            <MessagesChat />
          </>}
       </Row>
    </Content>
   )
};

export default MyMessages;