import React, { useEffect, useRef, useState } from "react";
import { Button,Typography, Form, Input } from "antd";
import { useSelector } from "react-redux";

import styles from "../../../../../styles/Parts/Header/Owner/RecoverPassword/RecoverPassword.module.scss";
import handleGQLRequest from "../../../../../request/handleGQLRequest";
import { TimeStampType, UserType } from "../../../../../types/types";
import { getTimeString } from "../../../../../functions/functions";
import { IRootState } from "../../../../../store/store";

const RecoverPassword = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [emailCodePass, setEmailCodePass] = useState<string|number>("");
    const [message, setMessage] = useState<string>("");
    const [recoveringStatus, setRecoveringStatus] = useState<string>("getCode");
    const [code, setCode] = useState<number>();
    const [newPassword, setNewPassword] = useState<string>("");
            //    should be given from the config 
    const [timestamp, setTimestamp] = useState<TimeStampType>({min: 3, sec: 0});
    const storeUser:UserType = useSelector<IRootState>((state) => state.user.user) as any;
    const confirmInterval = useRef<any>();


    const getCode = () => {
        (async () => {
            setLoading(true)
            const response = await handleGQLRequest("RecoverPassword", { email: emailCodePass });
            if (response?.RecoverPassword?.code) {
               setRecoveringStatus("confirm");
               setCode(response?.RecoverPassword?.code);
               confirmInterval.current = setInterval(() => {
                  if (timestamp.sec === 0 && timestamp.min === 0) {
                    clearInterval(confirmInterval.current);
                    return;
                  }
                  setTimestamp((curr:any) => {
                    if(curr.sec === 0 && curr.min === 0) {
                        return curr;
                    }
                    if(curr.sec <= 0) {
                        curr.sec = 59;
                        curr.min = curr.min - 1;
                    } else {
                       curr.sec = curr.sec - 1;
                    }
                    return {...curr};
                  });
               }, 1000);
               setLoading(false);
            } else if (response?.RecoverPassword?.message) {
                setMessage(response?.RecoverPassword?.message);
                setLoading(false);
            } else {
                setMessage("User Not Found");
                setLoading(false);
            }
        })()
    };

    const confirm = () => {
        if (emailCodePass === code) {
            setRecoveringStatus("setPassword");
        }
    };

    const changePassword = async () => {
        console.log(storeUser.password,emailCodePass);
        
         if (storeUser.password === emailCodePass) {
            // .............
             console.log("same");
             const newPassword = await handleGQLRequest("ChangePassword")
         }
    };

    useEffect(() => {
       setMessage("");
    }, [recoveringStatus]);

    return (
        <div className={styles.recover_password_main}>
            <Typography>
               {recoveringStatus === "getCode" ? " Enter your email to get the verification code" :
                recoveringStatus === "confirm" ? "Enter the verification code sent to your email" : ""}
            </Typography>
            <Form onFinish={recoveringStatus === "getCode" ? getCode : recoveringStatus === "confirm" ? confirm : recoveringStatus === "setPassword" ? changePassword : () => {}}>
                <Form.Item
                    className={styles.form_item}
                    name={recoveringStatus === "getCode" ? "email" : recoveringStatus === "confirm" ? "code" : recoveringStatus === "setPassword" ? "password" : ""}
                    rules={[{ required: true, min: 4 }]}
                >
                    <Input
                        value={emailCodePass}
                        
                        onChange={(e) => setEmailCodePass(e?.target?.value)}
                        placeholder={recoveringStatus === "getCode" ? "Email" : recoveringStatus === "confirm" ? "Code" : recoveringStatus === "setPassword" ? "Old Password" : ""}
                        className={styles.sign_input} />
                </Form.Item>
                { recoveringStatus === "setPassword" &&   
                  <Form.Item
                    className={styles.form_item}
                    name={"repeatPassword"}
                    rules={[{ required: true, min: 4 }]}
                >
                    <Input
                        value={newPassword}
                        onChange={(e) => setNewPassword(e?.target?.value)}
                        placeholder="New Password"
                        className={styles.sign_input} />
                </Form.Item>}
                { recoveringStatus === "confirm" &&
                <Typography>
                    {getTimeString(timestamp)}
                </Typography>
                }
                <Typography>
                    {message}
                </Typography>
                <Form.Item
                    className={styles.form_item_button}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className={styles.sign_button}
                    >
                       {recoveringStatus === "getCode" ?  "Get Code" : 
                        recoveringStatus === "confirm" ? "Confirm" :
                        recoveringStatus === "setPassword" ? "Change Password" : ""}
                    </Button>
                </Form.Item>
            </Form> 
        </div>
    )
};

export default RecoverPassword;