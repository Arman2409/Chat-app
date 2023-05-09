import { Layout, Typography, Row, Avatar, Badge } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef, useCallback } from "react";
import { Dispatch } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import { HiOutlineUserAdd } from "react-icons/hi";
import { WechatFilled } from "@ant-design/icons"
import { CiLogin } from "react-icons/ci"
import { IoPersonSharp } from "react-icons/io5";
import Image from "next/image";
import { io } from "socket.io-client";
import { useMediaQuery } from "react-responsive";

import Logo from "/assests/logo-files/svg/logo-no-background.svg";
import { IRootState } from "../../../store/store";
import styles from "../../../styles/Parts/Header/Header.module.scss";
import Owner from "./Owner/Owner";
import { setUserWindow } from "../../../store/windowSlice";
import { setStoreUser } from "../../../store/userSlice";
import {UserType} from "../../../types/types";
import FriendRequests from "./FriendRequests/FriendRequests";
import handleGQLRequest from "../../../request/handleGQLRequest";
import { setSocket } from "../../../store/socketSlice";
import useOpenAlert from "../../Tools/hooks/useOpenAlert";
import { getSlicedWithDots } from "../../../functions/functions";
import { setLoaded } from "../../../store/windowSlice";
import { windowLoadTime } from "../../../../configs/configs";

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
    const storeUser = useSelector<IRootState>((state) => state.user.user);
    const userWindow: boolean = useSelector((state: IRootState) => state.window.userWindow);
    const dispatch: Dispatch = useDispatch();

    const isSmall: boolean = useMediaQuery({ query: "(max-width: 500px)" });

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
    }, [router.pathname])

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

    return (
        <Header className={styles.header_main}>
            <Link href="/">
                <div
                    className={styles.header_logo_cont}
                    style={{
                        width: isSmall ? "100px" : "150px",
                        height: isSmall ? "100px" : "100px"
                    }}
                >
                    <Image 
                      src={Logo} 
                      alt={"Talk Space"}
                      style={{
                        width: "100%",
                        height: "100%"
                      }}
                      />
                    {/* //    width={"100%"} height={"100%"}/> */}
                 </div>
            </Link>
            {inPage ?
               <>
                <div className={styles.open_cont}>
                  {user.name && displayMessages &&
                    <WechatFilled 
                    onClick={() => openMessages()} 
                    className={styles.open_cont_icon}/>
                  }
                </div> 
                <Badge
                    dot={user ? Boolean(user.friendRequests?.length) : false}
                    className={styles.requests_badge}>
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
            {ownerState && <Owner userContRef={userContRef}/>}
        </Header>
    )
}

export default AppHeader;