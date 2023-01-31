import {Typography, theme, Pagination} from "antd";
import {useMediaQuery} from "react-responsive";
import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";

import {IRootState} from "../../../store/store";

import ListMaper from "../../Custom/UsersMapper/UsersMapper";
import styles from "../../../styles/Users/UsersOnline.module.scss";
import handleGQLRequest from "../../../requests/handleGQLRequest";
import {UserType} from "../../../types/types";

const UsersList: React.FunctionComponent = () => {
    const isSmall = useMediaQuery({query: "(max-width: 481px)"});
    const [current, setCurrent] = useState<number>(1);
    const user: UserType = useSelector((state: IRootState) => state.user.user);
    const [users, setUsers] = useState<UserType[]>([]);
    const [total, setTotal] = useState<number>(1);


    const getOnlineFriends = () => {
        (async function () {
            const onlineFriends = await handleGQLRequest("GetOnlineFriends", {page: current, perPage: 10});
            if (onlineFriends.GetOnlineFriends) {
                if (onlineFriends.GetOnlineFriends.users) {
                    setUsers(onlineFriends.GetOnlineFriends.data);
                    setTotal(onlineFriends.GetOnlineFriends.total)
                } else {
                    setUsers([]);
                    setTotal(1);
                }
            }
        })()
    }

    const changePage: Function = (e: any) => {
        setCurrent(e);
        getOnlineFriends();
    };

    useEffect(() => {
        if (user.name) {
            getOnlineFriends();
            // setDemoStatus(false);
        }
    }, [user])

    return (
        <div
            className={styles.users_online_cont}
            style={{
                width: isSmall ? "100%" : "50%",
            }}>
            {
                user.name ? null : (
                    <div className={styles.demo_main}>
                        <Typography className={styles.demo_main_text}>
                            Sign in to see friends online
                        </Typography>
                    </div>
                )
            }
            {user.name &&
                <Typography>
                    Friends Online
                </Typography>
            }
            <div style={{
                width: "1px",
                color: "black",
                position: "absolute",
            }}>

            </div>
            {user.name &&
                <div className="centered_users_cont">
                    <ListMaper users={users}/>
                    <Pagination
                        total={total}
                        className="users_pagination"
                        current={current}
                        onChange={(e) => changePage(e)}
                        showSizeChanger={false}/>
                </div>}
        </div>
    )
};

export default UsersList;