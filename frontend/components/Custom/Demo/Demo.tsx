import React from "react";
import { useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {Button, Typography} from "antd";

import styles from "../../../styles/Custom/Demo.module.scss";
import {setUserWindow} from "../../../store/userSlice";


const Demo:React.FC = () => {

    const dispatch:Dispatch = useDispatch();

    const openSignIn = () => {
        dispatch(setUserWindow(true));
    }

    return (
        <div className={styles.demo_main}>
            <Typography className={styles.demo_main_text}>
                Sign in to see friends online
            </Typography>
        </div>
    )
}

export default  Demo;