import Head from "next/head";
import { Layout, Row } from "antd";

import MessagesChat from "../components/Chat/MessagesChat/MessagesChat";
import LastMessages from "../components/Users/LastMessages/LastMessages";
import { useEffect } from "react";
const { Content } = Layout;
import { useRouter } from "next/router";

const MyMessages:React.FC = () => {
    
   
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