import {Layout, Typography, Row, Avatar, Badge} from "antd";
import {useRouter} from "next/router";
import Link from "next/link";
import {useSelector, useDispatch} from "react-redux";
import {useEffect, useState, useRef, useCallback} from "react";
import {Dispatch} from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import {HiOutlineUserAdd} from "react-icons/hi";
import {CiLogin} from "react-icons/ci"
import {IoPersonSharp} from "react-icons/io5";
import Image from "next/image";
import { io } from "socket.io-client";

import Logo from "/assests/logo-files/svg/logo-no-background.svg";
import {IRootState} from "../../../store/store";
import styles from "../../../styles/Parts/Header/Header.module.scss";
import Owner from "./Owner/Owner";
import {setStoreUser, setUserWindow} from "../../../store/userSlice";
import {UserType} from "../../../types/types";
import FriendRequests from "./FriendRequests/FriendRequests";
import handleGQLRequest from "../../../request/handleGQLRequest";
import { setSocket } from "../../../store/socketSlice";
import useOpenAlert from "../../Tools/hooks/useOpenAlert";
import { getSlicedWithDots } from "../../../functions/functions";
import { setLoaded } from "../../../store/windowSlice";

const {Header} = Layout;

const AppHeader: React.FunctionComponent = () => {
    const [ownerState, setOwnerState] = useState<boolean>(false);
    const [user, setUser] = useState<UserType>({} as UserType);
    const [inPage, setInPage] = useState<boolean>(true);
    const [watchingRequests, setWatchingRequests] = useState<boolean>(false);
    const router: any = useRouter();
    const storeUser = useSelector<IRootState>((state) => state.user.user);
    const userWindow: boolean = useSelector((state: IRootState) => state.user.userWindow);
    const dispatch: Dispatch = useDispatch();
    const addRef = useRef<any>([]);
    const userContRef = useRef<HTMLDivElement>(null);
    const { setMessageOptions } = useOpenAlert();

    const waitForSec = useCallback(() => {
        setTimeout(() => {
            dispatch(setLoaded(true));
        }, 1500)
    }, [setLoaded, dispatch]);

    const toggleUser = useCallback(() => {
        dispatch(setUserWindow(!userWindow));
        setOwnerState(userWindow);
    }, [dispatch, setUserWindow, userWindow]);

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
                    dispatch(setLoaded(true));
                })()
            }  else {
               waitForSec();
            }
        } else {
           waitForSec();
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
                        {user.name ? getSlicedWithDots(user.name, 15) : "Sign In"}
                    </Typography>
                    {user.name ? user.image ?
                        <Avatar src={user.image}/> :
                        <IoPersonSharp
                            className={styles.user_icon}
                        /> : <CiLogin  className={styles.user_icon} />
                    }
                </Row> : null}
            {
                user.name && watchingRequests ?
                    <FriendRequests clickOutside={clickOutside}/> : null
            }
            {ownerState && <Owner userContRef={userContRef}/>}
        </Header>
    )
}

export default AppHeader;