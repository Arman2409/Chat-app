import React, { useEffect, useState, useRef, useCallback, lazy, Suspense } from "react";
import { Layout, Typography, Row, Avatar, Badge } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import { HiOutlineUserAdd } from "react-icons/hi";
import { WechatFilled } from "@ant-design/icons"
import { CiLogin } from "react-icons/ci"
import { IoPersonSharp } from "react-icons/io5";
import Image from "next/image";
import { io } from "socket.io-client";

const Owner = lazy(() => import("./Owner/Owner"));
import styles from "../../../styles/Parts/Header/Header.module.scss";
import Logo from "../../../assests/logo-files/svg/logo-no-background-cropped.svg";
import { IRootState } from "../../../store/store";
import { setUserWindow } from "../../../store/windowSlice";
import { setStoreUser } from "../../../store/userSlice";
import {UserType} from "../../../types/types";
import FriendRequests from "./FriendRequests/FriendRequests";
import handleGQLRequest from "../../../request/handleGQLRequest";
import { setSocket } from "../../../store/socketSlice";
import useOpenAlert from "../../Tools/hooks/useOpenAlert";
import { getSlicedWithDots } from "../../../functions/functions";
import { setLoaded } from "../../../store/windowSlice";
import { windowLoadTime } from "../../../configs/configs";
import { setNotSeenCount } from "../../../store/messagesSlice";

const {Header} = Layout;

const AppHeader: React.FunctionComponent = () => {
    const [ownerState, setOwnerState] = useState<boolean>(false);
    const [user, setUser] = useState<UserType>({} as UserType);
    const [inPage, setInPage] = useState<boolean>(true);
    const [displayMessages, setDisplayMessages] = useState<Boolean>(false);
    const [watchingRequests, setWatchingRequests] = useState<boolean>(false);

    const addRef = useRef<any>([]);
    const userContRef = useRef<HTMLDivElement>(null);

    const router: any = useRouter();
    const storeUser: UserType = useSelector((state:IRootState) => state.user.user);
    const userWindow: boolean = useSelector((state: IRootState) => state.window.userWindow);
    const notSeenCount: boolean = useSelector((state:IRootState) => state.messages.notSeenCount);
    const dispatch: Dispatch = useDispatch();
    const socket = useSelector((state: IRootState) => {
        return state.socket.socket;
    });

    const { setMessageOptions } = useOpenAlert();

   const openMessages:Function = () => {
       if(!user.name) {
           setMessageOptions({
             message: "Sign in to message", 
             type: "warning"});
           return;
       }
     router.replace("/myMessages");
   };

    const waitForSec = useCallback(() => {
        setTimeout(() => {
            dispatch(setLoaded(true));
        }, windowLoadTime);
    }, [setLoaded, dispatch]);

    const clickOutside = (e: Event) => {
        if (e.target == addRef.current || addRef.current?.contains(e.target)) {
            return;
        }
        if (watchingRequests) setWatchingRequests(false);
    };

    const toggleUser = useCallback(() => {
        if (watchingRequests) setWatchingRequests(false);
        setOwnerState(curr => {            
            dispatch(setUserWindow(!curr));
            return !curr;
        });
    }, [dispatch, setUserWindow, userWindow]);

    useEffect(() => {
        setOwnerState(userWindow);
    }, [userWindow])

    useEffect(() => {
          if (router.pathname == "/myMessages" || router.pathname == "/404") {
           setDisplayMessages(false)
        } else {
          setDisplayMessages(true);
        }
        if(socket) {
            if (router.pathname === "/") {
                socket.emit("getNotSeenCount", (resp:any) => {
                   if(Object.hasOwn(resp, "notSeenCount")) {
                    dispatch(setNotSeenCount(resp.notSeenCount));
                   }
                });
            }
        }
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
                        let socket = io(process.env.NEXT_PUBLIC_SOCKETS_URL as any);
                        socket.emit("signedIn", {id: signedUser?.AlreadySigned?.id}, (resp:any) => {   
                            if (resp === "Signed In") {
                                dispatch(setSocket(socket));
                                dispatch(setStoreUser(signedUser?.AlreadySigned));
                            } else {
                                setMessageOptions({
                                    type: "warning",
                                    message: resp
                                })
                            }
                        });
                    }
                    dispatch(setLoaded(true));
                })()
            }  else {
               waitForSec();
            }
        } else {
           waitForSec();
        };
    }, []);

    return (
        <Header 
          className={styles.header_main}
        >
            <Link href="/"  className={styles.header_logo_link}>
                <div
                    className={styles.header_logo_cont}
                >
                    <Image 
                      src={Logo} 
                      alt={"Talk Space"}
                      style={{
                        width: "100%",
                        height: "100%"
                      }}
                      />
                 </div>
            </Link>
            {inPage ?
               <>
                  {user.name && displayMessages &&

                <Badge 
                  count={notSeenCount} 
                  className={styles.messages_open_badge}>
                    <WechatFilled 
                    onClick={() => openMessages()} 
                    className={styles.messages_open_badge_icon}/>
                </Badge> 
                  }
                <Badge
                    dot={user ? Boolean(user.friendRequests?.length) : false}
                    className={displayMessages ? styles.requests_badge : styles.requests_badge_messages}>
                    {user.name &&
                        <div ref={addRef}>
                            <HiOutlineUserAdd
                                onClick={() => {
                                    if (ownerState) setOwnerState(false);
                                    setWatchingRequests(current => !current)
                                }}
                                className={styles.requests_icon}/>
                        </div>
                    }
                </Badge>
                <Row
                    className={styles.user_cont}
                    ref={userContRef}
                    style={{
                        marginLeft: user.name ? "15px" : "auto"
                    }}
                    data-testid="toggleOwnerWindow"
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
                </Row> 
                </>
                 : null}
            {
                user.name && watchingRequests ?
                    <FriendRequests clickOutside={clickOutside}/> : null
            }
            {ownerState && 
                <Suspense fallback={""}>
                  <Owner userContRef={userContRef}/>
                </Suspense>}
        </Header>
    )
}

export default AppHeader;