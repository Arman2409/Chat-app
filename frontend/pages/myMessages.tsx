import Head from "next/head";
import React from "react";
import { Layout, Row } from "antd";

import MessagesChat from "../components/Chat/MessagesChat/MessagesChat";
import LastMessages from "../components/Users/LastMessages/LastMessages";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {io} from "socket.io-client";
import {useSelector} from "react-redux";
import {IRootState} from "../store/store";
const { Content } = Layout;


const MyMessages:React.FC = () => {
    const router:any = useRouter();
    const storeUser = useSelector<IRootState>((state:IRootState ) => state.user.user);

    useEffect(() => {
        const signed = localStorage.getItem("token")
        if(!signed ) {
            router.replace(404);
        }
        // socket.emit("connect", {
        //     data: "hello world"
        // })
    }, [])

    return (
    <Content style={{
        height: "calc(100vh - 160px)",
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