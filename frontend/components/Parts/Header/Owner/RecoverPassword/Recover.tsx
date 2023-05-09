import React, { useEffect, useRef, useState } from "react";
import { Button,Typography, Form, Input } from "antd";

import styles from "../../../../../styles/Parts/Header/Owner/RecoverPassword/RecoverPassword.module.scss";
import handleGQLRequest from "../../../../../request/handleGQLRequest";
import { RecoverProps, TimeStampType } from "../../../../../types/types";
import { getTimeString } from "../../../../../functions/functions";
import useOpenAlert from "../../../../Tools/hooks/useOpenAlert";
import { recoverPasswordWaitTime } from "../../../../../../configs/configs";

const RecoverPassword = ({changeStatus}:RecoverProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [emailCodePass, setEmailCodePass] = useState<string|number>("");
    const [message, setMessage] = useState<string>("");
    const [recoveringStatus, setRecoveringStatus] = useState<string>("getCode");
    const [recoverOptions, setRecoverOptions] = useState<any>({});
    const [repeatPassword, setRepeatPassword] = useState<string>("");
            //  .................  should be given from the config 
    const [timestamp, setTimestamp] = useState<TimeStampType>({min: recoverPasswordWaitTime / 1000, sec: 0});
    const confirmInterval = useRef<any>();
    const {setMessageOptions} = useOpenAlert();

    const getCode = () => {
        (async () => {
            setLoading(true)
            const response = await handleGQLRequest("RecoverPassword", { email: emailCodePass });
            if (response?.RecoverPassword?.code) {
               setRecoveringStatus("confirm");
               setRecoverOptions(response?.RecoverPassword);
               confirmInterval.current = setInterval(() => {
                  if (timestamp.sec === 0 && timestamp.min === 0) {
                    clearInterval(confirmInterval.current);
                    return;
                  }
                  setTimestamp((curr:any) => {
                    if(curr.sec === 0 && curr.min === 0) {
                        changeStatus("SignIn");
                        setMessageOptions({
                            type: "error",
                            messge: "Recovery failed"
                        });
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
        if (Number(emailCodePass) === recoverOptions.code) {
            setRecoveringStatus("setPassword");
        } else {
            setMessage("Wrong recovery code");
        }
    };

    const changePassword = async () => {
         if (emailCodePass === repeatPassword) {
             setLoading(true);
             const newPassword = await handleGQLRequest("ConfirmRecoveredPassword", {id: recoverOptions.id, newPassword: emailCodePass});
             
             if(newPassword?.ConfirmRecoveredPassword?.successMessage) {                
                setMessageOptions({
                    type: "success",
                    message: newPassword?.ConfirmRecoveredPassword?.successMessage
                });                
             } else if(newPassword?.ConfirmRecoveredPassword?.message) {
                setMessageOptions({
                    type: "error",
                    message: newPassword?.ConfirmRecoveredPassword?.message
                });
             } else {
                setMessageOptions({
                    type: "error",
                    message: "Not Changed"
                });
            }
            setTimeout(() => {
              changeStatus("SignIn");
            }, 350);
             
         } else {
            setMessage("Please repeat the password");
         }
    };

    useEffect(() => {
       setMessage("");
       setLoading(false);
    }, [recoveringStatus]);

    return (
        <div className={styles.recover_password_main}>
            <Typography className={styles.recover_password_main_title} style={{
                color: recoveringStatus === "failed" ? "red" : "",
            }}>
               {recoveringStatus === "getCode" ? " Enter your email to get the verification code" :
                recoveringStatus === "confirm" ? "Enter the verification code sent to your email" : ""}
            </Typography>
            <Form 
              className={styles.form_item}
              onFinish={recoveringStatus === "getCode" ? getCode :
                            recoveringStatus === "confirm" ? confirm :
                           recoveringStatus === "setPassword" ? changePassword : () => {}}>
                <Form.Item
                    className={styles.form_item}
                    name={recoveringStatus === "getCode" ? "email" :
                          recoveringStatus === "confirm" ? "code" :
                          recoveringStatus === "setPassword" ? "password" : ""}
                    rules={recoveringStatus === "setPassword" ? [{ required: true, min: 8 }] : [{ required: true, min: 4 }]}
                >
                    <Input
                        value={emailCodePass}
                        disabled={loading}
                        onChange={(e) => setEmailCodePass(e?.target?.value)}
                        placeholder={recoveringStatus === "getCode" ? "Email" :
                                     recoveringStatus === "confirm" ? "Code" :
                                     recoveringStatus === "setPassword" ? "New Password" : ""}
                        className={styles.sign_input} />
                </Form.Item>
                { recoveringStatus === "setPassword" &&   
                  <Form.Item
                    className={styles.form_item}
                    name={"repeatPassword"}
                    rules={[{ required: true, min: 4 }]}
                >
                    <Input
                        disabled={loading}
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e?.target?.value)}
                        placeholder="Repeat Password"
                        className={styles.sign_input} />
                </Form.Item>}
                { recoveringStatus === "confirm" &&
                <Typography className={styles.timeout_string}>
                    {getTimeString(timestamp)}
                </Typography>
                }
                <Typography className={styles.message}>
                    {message}
                </Typography>
                <Form.Item>
                    <Button
                        disabled={loading}
                        type="primary"
                        htmlType="submit"
                        className={styles.recover_button}
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