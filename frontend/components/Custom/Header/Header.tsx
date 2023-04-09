import {Layout, Typography, Row, Avatar, message, Badge} from "antd";
import {useRouter} from "next/router";
import Link from "next/link";
import {useSelector, useDispatch} from "react-redux";
import {useEffect, useState, useRef} from "react";
import {Dispatch} from "@reduxjs/toolkit";
import {useOnClickOutside} from "usehooks-ts";
import jwtDecode from "jwt-decode";
import {HiOutlineUserAdd} from "react-icons/hi";
import {IoPersonSharp} from "react-icons/io5";
import Image from "next/image";
import { io } from "socket.io-client";

import Logo from "/logo-files/svg/logo-no-background.svg";
import {IRootState} from "../../../store/store";
import styles from "../../../styles/Custom/Header/Header.module.scss";
import Owner from "./Owner/Owner";
import {setStoreUser, setUserWindow} from "../../../store/userSlice";
import {UserType} from "../../../types/types";
import ownerStyles from "../../../styles/Custom/Header/Owner/Owner.module.scss";
import FriendRequests from "./FriendRequests/FriendRequests";
import handleGQLRequest from "../../../requests/handleGQLRequest";
import { setSocket } from "../../../store/socketSlice";
import useOpenAlert from "../../../hooks/useOpenAlert";

const {Header} = Layout;

const AppHeader: React.FunctionComponent = () => {
    const [ownerState, setOwnerState] = useState<boolean>(false);
    const storeUser = useSelector<IRootState>((state) => state.user.user);
    const [user, setUser] = useState<UserType>(storeUser as UserType);
    const router: any = useRouter();
    const userWindow: boolean = useSelector((state: IRootState) => state.user.userWindow);
    const dispatch: Dispatch = useDispatch();
    const ownerRef = useRef<any>(null);
    const userContRef = useRef<HTMLDivElement>(null);
    const [watchingRequests, setWatchingRequests] = useState<boolean>(false);
    const addRef = useRef<any>([]);
    const [inPage, setInPage] = useState<boolean>(true);
    const { setMessageOptions } = useOpenAlert();

    const toggleUser: Function = (): void => {
        dispatch(setUserWindow(!userWindow));
    };

    useOnClickOutside(ownerRef, (e) => {
        if (e.target == userContRef.current || userContRef.current?.contains(e.target as Node)) {
            return;
        }
        dispatch(setUserWindow(false));
    });

    useEffect(() => {
        setOwnerState(userWindow);
    }, [userWindow]);

    useEffect(() => {
        if (ownerState) {
            setOwnerState(false);
            dispatch(setUserWindow(false));
        }
        if (router.pathname == "/404") {
            setInPage(false);
        } else {
            setInPage(true);
        }
    }, [router.pathname]);

    useEffect(() => {
        setUser(storeUser as UserType);
    }, [storeUser]);


    useEffect(() => {
        const token: string | null = localStorage.getItem("token");
        if (token) {
            const localUser: UserType = jwtDecode(token);
            if (localUser.name) {
                (async () => {
                    const signedUser: any = await handleGQLRequest("AlreadySigned", {token});
                    if (signedUser?.AlreadySigned?.email) { 
                        let socket = io("ws://localhost:4000");
                        socket.emit("signedIn", {id: signedUser?.AlreadySigned?.id});
                        dispatch(setSocket(socket));
                        dispatch(setStoreUser(signedUser?.AlreadySigned));
                    } else {
                       setMessageOptions({
                         message: "Error occured",
                         type: "error"
                       })
                    }
                })()
            }
        }
        ;
    }, []);

    const clickOutside = (e: Event) => {
        if (e.target == addRef.current || addRef.current?.contains(e.target)) {
            return;
        }
        if (watchingRequests) setWatchingRequests(false);
    };

    return (
        <Header className={styles.header_main}>
            <Link href="/">
                <div
                    className={styles.header_cont}
                >
                    <Image src={Logo} alt={"Talk Space"} width={200} height={200}/>
                </div>
            </Link>
            {inPage ?
                <Badge
                    dot={user ? Boolean(user.friendRequests?.length) : false}
                    className={styles.requests_badge}>
                    {user.name &&
                        <div ref={addRef}>
                            <HiOutlineUserAdd
                                onClick={() => {
                                    setWatchingRequests(current => !current)
                                }}
                                className={styles.requests_icon}/>
                        </div>
                    }
                </Badge>
                : null}
            {inPage ?
                <Row
                    className={styles.user_cont}
                    ref={userContRef}
                    onClick={() => toggleUser()}>
                    <Typography className={styles.user_name}>
                        {user.name ? user.name : "Sign In"}
                    </Typography>
                    {user.image ?
                        <Avatar src={user.image}/> :
                        <IoPersonSharp
                            className={styles.user_icon}
                        />}
                </Row> : null}
            {
                user.name && watchingRequests ?
                    <FriendRequests clickOutside={clickOutside}/> : null
            }
            {ownerState ?
                <div
                    className={ownerStyles.owner_main}
                    ref={ownerRef}>
                    <Owner/>
                </div> : null
            }
        </Header>
    )
}

export default AppHeader;