import { Menu, Layout, Typography, Row, Avatar } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { UserOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { Dispatch } from "@reduxjs/toolkit";
import { useOnClickOutside } from "usehooks-ts";
import jwtDecode from "jwt-decode";

import { IRootState } from "../../../store/store";
import styles from "../../../styles/Parts/Header/Header.module.scss";
import Owner from "./Owner/Owner";
import { setStoreUser, setUserWindow } from "../../../store/userSlice";
import { UserType } from "../../../types/types";
import ownerStyles from "../../../styles/Parts/Header/Owner/Owner.module.scss";


const { Header } = Layout;

const itemsArray = [
  {
    label: "Dashboard",
    route: "/dashboard"
  },
  {
    label: "My Friends",
    route: "/myFriends"
  }
];

const AppHeader: React.FunctionComponent = () => {
  const [ownerState, setOwnerState] = useState<boolean>(false);
  const storeUser = useSelector<IRootState>((state) => state.user.user);
  const [user, setUser] = useState<UserType>(storeUser as UserType);
  const router: any = useRouter();
  const userWindow: boolean = useSelector((state: IRootState) => state.user.userWindow);
  const dispatch: Dispatch = useDispatch();
  const ownerRef = useRef<any>(null);
  const userContRef = useRef<HTMLDivElement>(null);

  const changePath: Function = (e: string): void => {
    if (window.location.pathname == e) {
      return;
    };
    router.replace(e);
  };

  const toggleUser: Function = (): void => {
    dispatch(setUserWindow(!userWindow));
  };

  useOnClickOutside(ownerRef, (e) => {
    if(e.target == userContRef.current || userContRef.current?.contains(e.target as Node)) {
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
     const token = localStorage.getItem("token");
     if(token) {
        dispatch(setStoreUser(jwtDecode(token)));
     };
  }, []);

  return (
    <Header className={styles.header_main}>
      <Link href="/">
        <div
          className={styles.header_cont}
        >
          Chat Net
        </div>
      </Link>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        items={itemsArray.map((item, index) => ({
          key: String(index + 1),
          label: item.label,
          onClick: () => changePath(item.route)
        }) as any)}
      />
      <Row
        className={styles.user_cont}
        ref={userContRef}
        onClick={() => toggleUser()}>
        <Typography className={styles.user_name}>
          {user.name ? user.name : "Sign In"}
        </Typography>
        {user.image ?
          <Avatar src={user.image} /> :
          <UserOutlined
            className={styles.user_icon}
          />}
      </Row>
      {ownerState ?
        <div
          className={ownerStyles.owner_main}
          ref={ownerRef}>
          <Owner />
        </div> : null
      }
    </Header>
  )
}

export default AppHeader;