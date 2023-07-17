import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { RiUser4Line, RiUserSearchFill } from "react-icons/ri";
import { TbListSearch } from "react-icons/tb";
import { WaveLoading } from "react-loading-typescript";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { List, Avatar, Typography, Badge, Button } from "antd";

const UserDropdown = lazy(() => import("../UserDropdown/UserDropdown"));
import styles from "../../../styles/Custom/UsersMapper.module.scss";
import { IRootState } from "../../../store/store";
import useOpenAlert from "../../Tools/hooks/useOpenAlert";
import type { UsersMapperProps } from "../../../types/propTypes";
import type { UserType } from "../../../types/types";
import { setInterlocutor } from "../../../store/messagesSlice";
import { getSlicedWithDots } from "../../../functions/functions";
import { usersLoadWaitTime } from "../../../configs/configs";
import { setMenuOption } from "../../../store/windowSlice";

const UsersMapper: React.FC<UsersMapperProps> = ({ users: userItems, parentElementRef, page, setLoadingSearchType, loadingSearchType, total = 0, friends, friendRequests, lastMessages, accept }: UsersMapperProps) => {
    const [emptyText, setEmptyText] = useState<string>("");
    const [users, setUsers] = useState(userItems)
    const [loading, setLoading] = useState<boolean>(false);
    const [openedDropdown, setOpenedDropdown] = useState<string>("");
    const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false);
    const gettingUsersRef = useRef<boolean>(false);
    const acceptLink = useRef<any>(null);
    const listRef = useRef<any>(null);

    const router = useRouter();
    const dispatch: Dispatch = useDispatch();

    const user = useSelector((state: IRootState) => {
        return state.user.user
    });
    const { interlocutor:storeInterlocutor , messagesData } = useSelector((state: IRootState) => {
        return state.messages;
    });

    const { setMessageOptions } = useOpenAlert();

    const acceptRequest = useCallback(async (item: any, e: any) => {
        e.stopPropagation();
        setButtonsDisabled(true);
        accept ? await accept(item.id) : null;
    }, [accept, setButtonsDisabled]);

    const handleScroll = (e: any, isTouchEvent?: boolean) => {
        setOpenedDropdown(" ");
        let parentContains = false;
        if(parentElementRef) {
             parentContains = parentElementRef.current?.contains(e.target);
        }
        if (listRef.current?.contains(e.target) || listRef.current === e.target || parentContains) {
            if (e.deltaY > 0 || isTouchEvent) {
                if (listRef.current.scrollTop >= (listRef.current.scrollHeight - listRef.current.clientHeight)) {
                    if (loading) {
                        return;
                    };
                    if (gettingUsersRef.current) {
                        return;
                    }
                    if (total <= users.length) {
                        return;
                    };
                    gettingUsersRef.current = true;
                    setLoading(true);
                    setLoadingSearchType("newPage" + page);
                }
            };
        }
    };

    const newChat = useCallback((e: UserType) => {
        if (!user.name) {
            setMessageOptions({
                message: "Sign in to message",
                type: "warning"
            });
            return;
        };
        dispatch(setInterlocutor(e));
        dispatch(setMenuOption("chat"));
        router.push("/myMessages");
    }, [dispatch, setMessageOptions, router, user, setMenuOption, setInterlocutor]);

    const openDropdown = useCallback((email: string) => {
        setOpenedDropdown(email);
    }, [setOpenedDropdown]);

    useEffect(() => {
        setEmptyText(friends ? "No Friends Found" : lastMessages ? "No Messages Found" : "No Users Found");
        setButtonsDisabled(false);
        setLoading(false);
        gettingUsersRef.current = false
    }, [users, setUsers, storeInterlocutor, messagesData]);

    useEffect(() => {
        if (loading) {
            window.removeEventListener("wheel", handleScroll, true);
            setTimeout(() => {
                if (loading) {
                    setLoading(false);
                    setLoadingSearchType("gotUsers")
                }
            }, usersLoadWaitTime);
        } else {
            window.addEventListener("wheel", handleScroll, true);
        }
    }, [loading]);

    useEffect(() => {
        setUsers(userItems);
    }, [userItems]);

    useEffect(() => {
        if (lastMessages) {
            if (messagesData.blocked) {
                return;
            }
        }
    }, [messagesData, setUsers]);

    useEffect(() => {
        window.addEventListener("touchmove", (e) => handleScroll(e, true))
    }, []);

    return (
        <div ref={listRef}
            className={`${styles.list}`}
        >
            {users.length === 0 && !loading && !loadingSearchType && <div className={styles.empty_cont}>
                {lastMessages ? <TbListSearch className={styles.empty_icon} /> : <RiUserSearchFill className={styles.empty_icon} />}
                <p className={styles.empty_text}>{emptyText}</p>
            </div>}
            {users.map((item:UserType, index:number) => {
                const isInterlocutor = item.id === storeInterlocutor.id;
                const isBlocked = user.blockedUsers?.includes(item.id);
                const isRequested = user.sentRequests?.includes(item.id) || user.friendRequests?.includes(item.id);
                return (
                    <List.Item
                        key={index}
                        onClick={() => newChat(item)}
                        data-testid="listItem"
                        className={lastMessages ? isInterlocutor ? styles.list_item_message_interlocutor : styles.list_item_message : styles.list_item}
                    >
                        <Badge dot={item.active ? true : false}>
                            {item.image ? <Avatar src={item.image} /> : <RiUser4Line className={styles.list_item_user_avatar} />}
                        </Badge>
                        <div>
                            <Typography>{item.name}</Typography>
                            {!item.active && <Typography className="list_item_date">{item?.lastVisited}</Typography>}
                        </div>
                        {user.name ?
                            lastMessages ? <p className={styles.list_item_action_message}>
                                {item.lastMessage && getSlicedWithDots(item.lastMessage, 25)}
                                {Number(item.notSeenCount) ?
                                    <span className={styles.list_item_action_message_alert_span}>{item.notSeenCount}</span> : ""}
                            </p> : friendRequests ? <Button
                                className={styles.list_item_action_button}
                                loading={buttonsDisabled} ref={acceptLink}
                                onClick={(e) => acceptRequest(item, e)}>Accept</Button> :
                                <Suspense fallback={""}>
                                    <UserDropdown
                                        user={item}
                                        index={index}
                                        onClick={openDropdown}
                                        openElement={openedDropdown}
                                        isRequested={isRequested}
                                        isBlocked={isBlocked}
                                        type={friends ? "friend" : "all"}
                                    />
                                </Suspense>

                            : ""
                        }
                    </List.Item>
                )
            })}
            {loading && <div style={{ position: "relative", paddingTop: "25px" }}>
                <WaveLoading color="rgb(167, 117, 117)" {...{} as any} />
            </div>}
        </div>
    )
}

export default UsersMapper;