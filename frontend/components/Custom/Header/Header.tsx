import {Layout, Typography, Row, Avatar, message, Badge} from "antd";
import {useRouter} from "next/router";
import Link from "next/link";
import {UserOutlined} from "@ant-design/icons";
import {useSelector, useDispatch} from "react-redux";
import {useEffect, useState, useRef} from "react";
import {Dispatch} from "@reduxjs/toolkit";
import {useOnClickOutside} from "usehooks-ts";
import jwtDecode from "jwt-decode";
import {HiOutlineUserAdd} from "react-icons/hi";

import {IRootState} from "../../../store/store";
import styles from "../../../styles/Custom/Header/Header.module.scss";
import Owner from "./Owner/Owner";
import {setStoreUser, setUserWindow} from "../../../store/userSlice";
import {UserType} from "../../../types/types";
import ownerStyles from "../../../styles/Custom/Header/Owner/Owner.module.scss";
import FriendRequests from "./FriendRequests/FriendRequests";
import handleGQLRequest from "../../../requests/handleGQLRequest";

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
    }, [router.pathname]);

    useEffect(() => {
        setUser(storeUser as UserType);
    }, [storeUser]);


    useEffect(() => {
        const token: string | null = localStorage.getItem("token");
        if (token) {
            const storeUser: UserType = jwtDecode(token);
            if (storeUser.name) {
                (async () => {
                    const signStatus: any = await handleGQLRequest("AlreadySigned", {token});
                    if(signStatus.AlreadySigned == "Done") {
                      dispatch(setStoreUser(storeUser));
                    } else {
                      message.error("Error Occured");
                    }
                })()
            }
        }
        ;
    }, []);

    const clickOutside = (e:Event) => {
        console.log(e)
        console.log(addRef.current)
        if(e.target == addRef.current || addRef.current?.contains(e.target)) {
            return;
        }
        if( watchingRequests)  setWatchingRequests(false);
    };

    return (
        <Header className={styles.header_main}>
            <Link href="/">
                <div
                    className={styles.header_cont}
                >
                    Chat Net
                </div>
            </Link>
            <Badge
                dot={user ? Boolean(user.friendRequests.length) : false}
                className={styles.requests_badge}>
                {user.name &&
                    <div ref={addRef}>
                        <HiOutlineUserAdd
                            onClick={() => { setWatchingRequests(current => !current)}}
                            className={styles.requests_icon}/>
                      </div>
                }
            </Badge>
            <Row
                className={styles.user_cont}
                ref={userContRef}
                onClick={() => toggleUser()}>
                <Typography className={styles.user_name}>
                    {user.name ? user.name : "Sign In"}
                </Typography>
                {user.image ?
                    <Avatar src={user.image}/> :
                    <UserOutlined
                        className={styles.user_icon}
                    />}
            </Row>
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