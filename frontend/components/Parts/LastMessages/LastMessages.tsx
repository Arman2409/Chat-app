import React, { useCallback, useEffect, useRef, useState } from "react";
import { Typography } from "antd";
import { useMediaQuery } from "react-responsive";
import { last, sortBy } from "lodash";
import { useSelector } from "react-redux";

import styles from "../../../styles/Parts/LastMessages.module.scss";
import UsersMapper from "../../Custom/UsersMapper/UsersMapper";
import handleGQLRequest from "../../../request/handleGQLRequest";
import { IRootState } from "../../../store/store";

const LastMessages: React.FC = () => {
   const [total, setTotal] = useState(100);
   const [loadingType, setLoadingType] = useState("");
   const [lastMessages, setLastMessages] = useState<any[]>([]);
   const [pageState, setPageState] = useState<number>(1);

   const pageRef = useRef<number>(1);
   const isRequestingRef = useRef<boolean>(true);
   const isMedium: boolean = useMediaQuery({ query: "(max-width: 750px)" });
   const isSmall: boolean = useMediaQuery({ query: "(max-width: 600px)" });
   const { messagesData }: any = useSelector((state: IRootState) => state.messages);

   const { interlocutor, interlocutorMessages } = useSelector((state: IRootState) => {
      return state.messages;
   });
   const storeUser = useSelector((state: IRootState) => state.user.user);

   const getLastMessages = useCallback(() => {
      isRequestingRef.current = true;
      (async function () {
         const lastMessagesData = await handleGQLRequest("GetLastMessages", { page: pageRef.current });
         let users = lastMessagesData?.GetLastMessages?.users || [];
         const fetchedInterlocutor = users.filter((elem: any) => elem.email === interlocutor.email)[0];
         if (fetchedInterlocutor) {
            users = sortBy(users, ({ id }) => id === fetchedInterlocutor.id ? 0 : 1);
         };

         setLastMessages(curr => {
            if (!curr.length) {
               return [...users || []];
            }
            if(loadingType === "getMissing") {
               return [...users]
            }
            return [ ...curr, ...users || []]
         });
         setTotal(lastMessagesData?.GetLastMessages?.total);
         isRequestingRef.current = false;
         setPageState(pageRef.current)
      })();
   }, [pageRef, setLastMessages, loadingType]);

   useEffect(() => {
      if (isRequestingRef.current) return;
      if (loadingType.startsWith("newPage")) {
         pageRef.current = pageRef.current + 1;
      };
      getLastMessages();
   }, [loadingType]);

   useEffect(() => {
      setLastMessages(lastMessages => {
        let hasCurrent:boolean = false; 
        const newLastMessages = lastMessages.map((elem: any) => {
            if(elem.id === interlocutor.id) {
               hasCurrent = true
            };
            if (messagesData.between.includes(elem?.id)) {
               const { id }: any = { ...storeUser || {} }
               const hasNotSeen:boolean = messagesData.between?.indexOf(id) === messagesData?.notSeen?.by;
               let lastMessage:any = last(messagesData?.messages);
               if(lastMessage?.audio) {
                  lastMessage = "(Voice Message)";
                } else if (lastMessage?.file) {
                  lastMessage = lastMessage.file.originalName;
                } else {
                  lastMessage = lastMessage?.text || "..."
                };
               elem = {
                  ...elem,
                  lastMessage,
                  notSeenCount: hasNotSeen ? messagesData.notSeen.count : 0
               }
            }
             return elem;
         }) 
          if(!hasCurrent && !isRequestingRef.current) {
            setLoadingType("getMissing");
          }
         return newLastMessages;
        }
         );
   }, [messagesData, setLastMessages, isRequestingRef, interlocutorMessages, storeUser]);

   useEffect(() => {
      if(interlocutorMessages.updated) {
         setLastMessages([]);
         getLastMessages();
      }
   }, [interlocutorMessages]);

   useEffect(() => {
      getLastMessages();
   }, []);

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