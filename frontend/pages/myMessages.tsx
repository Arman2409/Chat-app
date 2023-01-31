import Head from "next/head";
import React from "react";
import { Layout, Row } from "antd";
import {useRouter} from "next/router";
import {useEffect} from "react";

import MessagesChat from "../components/Chat/MessagesChat/MessagesChat";
import LastMessages from "../components/Users/LastMessages/LastMessages";
const { Content } = Layout;


const MyMessages:React.FC = () => {
    const router:any = useRouter();

    useEffect(() => {
        const signed = localStorage.getItem("token")
        if(!signed ) {
            router.replace(404);
        }
    }, [])

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
         <LastMessages />    
         <MessagesChat />
       </Row>
    </Content>
   )
};

export default MyMessages;