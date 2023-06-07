import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Typography, Button } from "antd";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { useOnClickOutside } from "usehooks-ts";

import styles from "../../../../styles/Parts/Header/Owner/Owner.module.scss";
import SignInUp from "./SignInUp/SignInUp";
import { UserType } from "../../../../types/types";
import { IRootState } from "../../../../store/store";
import handleGQLRequest from "../../../../request/handleGQLRequest";
import { setStoreUser } from "../../../../store/userSlice";
import { setUserWindow } from "../../../../store/windowSlice";
import RecoverPassword from "./RecoverPassword/Recover";

const Owner = ({userContRef}:any) => {
    const [message, setMessage] = useState<string>("");
    const [signStatus, setSignStatus] = useState<string>("SignIn");
    const [user, setUser] = useState<UserType>({} as UserType);
    const dispatch: Dispatch = useDispatch();
    const ownerRef = useRef<any>();
    const storeUser = useSelector<IRootState>((state) => state.user.user);

    const changeSignStatus = () => {
        setSignStatus(status => status == "SignIn" ? "SignUp" : "SignIn");
    }

    const socket = useSelector((state: IRootState) => {
        return state.socket.socket;
    });

     const signOut = useCallback(async () => {
        const resp = await handleGQLRequest("SignOut");
        socket.disconnect();
        if (resp.SignOut) {
            if (resp.SignOut == "Signed Out") {
                localStorage.removeItem("token");
                dispatch(setStoreUser({ name: "", email: "", image: "" , friendRequests: [], friends: [], active: false}));
            }
        } else {
            setMessage("Error Occured");
        }
    }, [setMessage, socket, dispatch, setStoreUser]);

    useOnClickOutside(ownerRef, (e) => {
        if (e.target == userContRef.current || userContRef.current?.contains(e.target as Node)) {
            return;
        }
        dispatch(setUserWindow(false));
    });

    useEffect(() => {
        setUser(storeUser as UserType);
    }, [storeUser]);

    useEffect(() => {
       setMessage("");
    }, [signStatus])

    return (
        <div
        role="ownerWindow"
        className={styles.owner_main}
        ref={ownerRef}>
            {user.name ?
                <>
                    <div className={styles.data_cont}>
                        <Typography className={styles.owner_email}>
                            {user.email}
                        </Typography>
                        <Button 
                          className={styles.signout_button}
                          type="primary"
                          onClick={() => signOut()}>
                            Sign Out
                        </Button>
                    </div>
                    <div>
                        <Typography>
                            {message}
                        </Typography>
                    </div>
                </> :
                <>
                    {signStatus == "SignUp" ?
                        <SignInUp changeStatus={changeSignStatus} type={"SignUp"} />      
                      : signStatus == "SignIn" ?
                        <SignInUp  changeStatus={changeSignStatus} type={"SignIn"} />
                        : signStatus == "Recover" ?
                           <RecoverPassword changeStatus={changeSignStatus} />
                     : null}
                    <div className={styles.owner_link_cont}>
                        <a
                            onClick={() => setSignStatus(status => status == "SignIn" ? "SignUp" : "SignUp" ? "SignIn" : "Recover" ? "SignIn" : "")}
                            className={styles.owner_link_cont_link}>
                            {signStatus == "SignUp" ? "Sign In" : signStatus == "SignIn" ? "Sign Up" : signStatus == "Recover" ? "Sign In" : "" }
                        </a>
                       {signStatus == "SignIn" && 
                        <a
                           onClick={() => setSignStatus("Recover")}
                           className={styles.owner_link_cont_link}>
                             Forgot Password
                         </a>}
                    </div>
                </>
            }
        </div>
    )
}

export default Owner;