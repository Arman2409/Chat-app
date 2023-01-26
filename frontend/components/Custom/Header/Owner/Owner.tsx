import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Typography, Button } from "antd";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";

import styles from "../../../../styles/Custom/Header/Owner/Owner.module.scss";
import SignInUp from "./SignInUp/SignInUp";
import { UserType } from "../../../../types/types";
import { IRootState } from "../../../../store/store";
import handleGQLRequest from "../../../../requests/handleGQLRequest";
import { setStoreUser } from "../../../../store/userSlice";
import {socket} from "../../../../pages/_app";

const Owner = () => {
    const [signStatus, setSignStatus] = useState<string>("SignIn");
    const storeUser = useSelector<IRootState>((state) => state.user.user);
    const [user, setUser] = useState<UserType>(storeUser as UserType);
    const dispatch: Dispatch = useDispatch();
    const [message, setMessage] = useState<string>("");

    const changeSignStatus = () => {
        setSignStatus(status => status == "SignIn" ? "SignUp" : "SignIn");
    }

    async function signOut() {
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
    };

    useEffect(() => {
        setUser(storeUser as UserType);
    }, [storeUser]);

    return (
        <>
            {user.name ?
                <>
                    <div className={styles.data_cont}>
                        <Typography className={styles.owner_email}>
                            {user.email}
                        </Typography>
                        <Button type="primary" onClick={() => signOut()}>
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
                        <SignInUp changeStatus={changeSignStatus} compType={"SignUp"} />
                        : null}
                    {signStatus == "SignIn" ?
                        <SignInUp  changeStatus={changeSignStatus} compType={"SignIn"} />
                        : null}
                    <div style={{
                        margin: "15px"
                    }}>
                        <a
                            onClick={() => setSignStatus(status => status == "SignIn" ? "SignUp" : "SignIn")}
                            className={styles.owner_link}>
                            {signStatus == "SignUp" ? "Sign In" : "Sign Up"}
                        </a>
                    </div>
                </>
            }
        </>
    )
}

export default Owner;