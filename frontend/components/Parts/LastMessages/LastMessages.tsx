import React, { useCallback, useEffect, useRef, useState } from "react";
import { Typography } from "antd";
import { useMediaQuery } from "react-responsive";
import { last, sortBy } from "lodash";
import { useSelector } from "react-redux";

import styles from "../../../styles/Parts/LastMessages.module.scss";
import UsersMapper from "../../Custom/UsersMapper/UsersMapper";
import handleGQLRequest from "../../../request/handleGQLRequest";
import { IRootState } from "../../../store/store";

const LastMessages:React.FC = () => {
   const [total, setTotal] = useState(100);
   const [loadingType, setLoadingType] = useState("");
   const [lastMessages, setLastMessages] = useState<any[]>([]);
   const [pageState, setPageState] = useState<number>(1);

   const pageRef = useRef<number>(1);
   const isRequestingRef = useRef<boolean>(false);
   const isMedium: boolean = useMediaQuery({query: "(max-width: 750px)"});
   const isSmall: boolean = useMediaQuery({ query: "(max-width: 500px)" });
   const {messagesData}:any = useSelector((state: IRootState) => state.messages);

   const {interlocutor, interlocutorMessages} = useSelector((state: IRootState) => {
      return state.messages;
   });
   const storeUser = useSelector((state:IRootState) => state.user.user);

   const getInterlocutorData = useCallback((alreadyAdded:any) => {
      if (alreadyAdded || interlocutor.name) {
         return [];
      } else {
         return [{
            ...interlocutor,
            lastMessage: last(interlocutorMessages.messages) || "",
         }]
      }
   }, [interlocutor, interlocutorMessages])
   
   const getLastMessages = useCallback(() => {            
      (async function() {
         const lastMessagesData = await handleGQLRequest("GetLastMessages", {page: pageRef.current});   
         let users = lastMessagesData?.GetLastMessages?.users || []; 
         const fetchedInterlocutor = users.filter((elem:any) => elem.email === interlocutor.email)[0];
         if(fetchedInterlocutor) { 
           users = sortBy(users, ({id}) => id === fetchedInterlocutor.id ? 0 : 1);
         };
         
         setLastMessages(curr => {
            if (!curr.length) {
               return [...users || []]
            }
            return [...getInterlocutorData(fetchedInterlocutor), ...curr, ...users || []]
         });
         setTotal(lastMessagesData?.GetLastMessages?.total);
         isRequestingRef.current = false;
         setPageState(pageRef.current)
       })();
   }, [pageRef]);

   useEffect(() => {
      if(isRequestingRef.current) return;
      if(loadingType.startsWith("newPage")) {   
         pageRef.current = pageRef.current + 1;
         getLastMessages();
         isRequestingRef.current = true;
      };
   }, [loadingType]);

   useEffect(() => {
      getLastMessages();
   }, []);

   useEffect(() => {
         setLastMessages(messages => messages.map((elem:any) => {     
            if(messagesData.between?.includes(elem.id)){
               const { id }:any = {...storeUser || {}}
               const hasNotSeen = messagesData.between?.indexOf(id) === messagesData?.notSeen?.by;
               
               return {
                  ...elem,
                  lastMessage: last(messagesData?.messages),
                  notSeenCount: hasNotSeen ? messagesData.notSeen.count : 0,
               };
            }
            return elem;
         }));
   }, [messagesData, setLastMessages]);

   useEffect(() => {
     setLastMessages(currents => currents.map((elem:any) => {
        if (interlocutorMessages.between?.includes(elem.id)) {
           if (interlocutorMessages.notSeen.count !== elem.notSeenCount) {
             return {
               ...elem,
               notSeenCount: interlocutorMessages.notSeen.count
             }
           } else {
            return elem;
           }
        } else {
         return elem;
        };
     }))
        
   }, [interlocutorMessages, setLastMessages]);
   
    return (
       <div 
         className={styles.lastMessages_cont} 
         style={{
            width: isSmall ? "100%" : isMedium ? "58%" : "50%",
         }}>
         <Typography className={styles.lastMessages_cont_title}>
            Last Messages
         </Typography>
         <div className="centered_users_cont">
            <UsersMapper
              lastMessages={true} 
              total={total} 
              page={pageState}
              loadingSearchType={loadingType}
              setLoadingSearchType={setLoadingType}
              users={lastMessages} />
         </div>
       </div>
    )
};

export default LastMessages;