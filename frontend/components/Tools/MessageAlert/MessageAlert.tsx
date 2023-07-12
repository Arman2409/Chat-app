import React, {useCallback, useEffect, useState} from "react";
import {message, Card, Avatar} from "antd";
import {useDispatch, useSelector} from "react-redux";
import router from "next/router";
import {Dispatch} from "@reduxjs/toolkit";
import {CloseCircleFilled} from "@ant-design/icons";

import styles from "../../../styles/Tools/MessageAlert.module.scss";
import type {UserType} from "../../../types/types";
import {IRootState} from "../../../store/store";
import handleGQLRequest from "../../../request/handleGQLRequest";
import {getSendersId, getSlicedWithDots} from "../../../functions/functions";
import {setInterlocutor} from "../../../store/messagesSlice";

const MessageAlert = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const storeUser: UserType = useSelector((state: IRootState) => state.user.user);
    const [fromUser, setFromUser] = useState<UserType>({} as UserType);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const dispatch: Dispatch = useDispatch();
    const {messagesData: data , interlocutor}:any = useSelector((state: IRootState) => state.messages);

    const watchMessage = useCallback(() => {
        dispatch(setInterlocutor(fromUser));
        messageApi.destroy(fromUser.name);
        setOpen(false);
        if (router.pathname !== "/myMessages") {
            router.push("/myMessages");
        } else {
            return;
        }
    }, [dispatch, fromUser, router])

    const closeAlert = useCallback((e:any) => {
        e.stopPropagation();
        messageApi.destroy(fromUser.name)
    }, [fromUser, messageApi])

    const Content = (
        <>
            {data.between.length ?
                <Card onClick={watchMessage} className={styles.message_alert_card} style={{padding: 0}}>
                    <Card.Meta avatar={<Avatar src={fromUser.image}/>} 
                               title={getSlicedWithDots(`${fromUser.name}`, 20)}
                               description={data.messages.length ? getSlicedWithDots(data.messages.at(-1), 25) : ""}
                               
                        />
                        <div 
                          onClick={closeAlert}
                          className={styles.close_cont}>
                            <CloseCircleFilled />
                        </div>
                </Card>
            : null}
        </>

    );

    useEffect(() => {
        if (!loading && data.between.length && !open) {
            setOpen(true);
            messageApi.open({
                content: Content,
                key: fromUser.name,
                duration: 500,
                className: "message-alert"
            })
        }
    }, [loading, messageApi]);

    useEffect(() => {
        messageApi.destroy(fromUser.name);
        setOpen(false);
        if (!data.between.length) return;        
        const fromId = getSendersId(data.between, storeUser.id);
        if(fromId === interlocutor.id) return;
        setLoading(true);
        (async function () {
            const response = await handleGQLRequest("FindUserById", {id: fromId});
            setFromUser(response.FindUserById ? response.FindUserById : {});
            setLoading(false);
        })();
        
        return () => {
            messageApi.destroy(fromUser.name);
            setOpen(false);
        }
    }, [data])

    return (
        <>
            {contextHolder}
        </>
    )
};

export default MessageAlert;