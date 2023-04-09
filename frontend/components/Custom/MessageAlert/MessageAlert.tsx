import React, {useCallback, useEffect, useState} from "react";
import {message, Card, Avatar} from "antd";
import {useDispatch, useSelector} from "react-redux";
import router from "next/router";
import {Dispatch} from "@reduxjs/toolkit";

import {UserType} from "../../../types/types";
import {IRootState} from "../../../store/store";
import handleGQLRequest from "../../../requests/handleGQLRequest";
import styles from "../../../styles/Custom/MessageAlert.module.scss";
import {getSendersId, getSlicedWithDots} from "../../../functions/functions";
import {setInterlocutor} from "../../../store/messagesSlice";

const MessageAlert = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const storeUser: UserType = useSelector((state: IRootState) => state.user.user);
    const {messagesData: data , interlocutor, alertState}:any = useSelector((state: IRootState) => state.messages);
    const [fromUser, setFromUser] = useState<UserType>({} as UserType);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch: Dispatch = useDispatch();
    const [open, setOpen] = useState<boolean>(false);

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

    const Content = (
        <>
            {data.between.length ?
                <Card onClick={watchMessage} className={styles.message_alert_card} style={{padding: 0}}>
                    <Card.Meta avatar={<Avatar src={fromUser.image}/>} title={getSlicedWithDots(`${fromUser.name}`, 20)}
                               description={data.messages.length ? getSlicedWithDots(data.messages.at(-1), 25) : ""}/>
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
        if (!data.between.length) {
            return;
        }
        
        const fromId = getSendersId(data.between, storeUser.id);
        if(fromId === interlocutor.id) {
            return;
        }
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