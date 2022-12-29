import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Typography, Button } from "antd";

import styles from "../../../../styles/Parts/Header/Owner/Owner.module.scss";
import SignInUp from "./SignInUp/SignInUp";
import { UserType } from "../../../../types/types";
import { IRootState } from "../../../../store/store";

const Owner = () => {
    const [signStatus, setSignStatus] = useState<string>("SignIn");
    const storeUser = useSelector<IRootState>((state) => state.user.user);
    const [user, setUser] = useState<UserType>(storeUser as UserType);

    useEffect(() => {
        setUser(storeUser as UserType);
    }, [storeUser]);

    return (
        <>
            {user.name ?
                <div className={styles.data_cont}>
                    <Typography>
                        {user.email}
                    </Typography>
                    <Button type="primary">
                        Sign Out
                    </Button>
                </div> :
                <>
                    {signStatus == "SignUp" ?
                        <SignInUp type={"SignUp"} />
                        : null}
                    {signStatus == "SignIn" ?
                        <SignInUp type={"SignIn"} />
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