import { Input, Pagination, Radio } from "antd";
import React, { ChangeEvent,useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { theme } from "antd";
import { useDebounce, useUpdateEffect } from "usehooks-ts";

const { useToken } = theme;
const { Search } = Input;

import styles from "../../../styles/Users/FindUser.module.scss";
import UsersMapper from "../UsersMapper/UsersMapper";
import {IRootState} from "../../../store/store";
import globalStyles from "../../../styles/globalClasses.module.scss";
import { ChangeType, SearchOptions, UserType } from "../../../types/types";
import handleGQLRequest from "../../../requests/handleGQLRequest";
import Loading from "../../Custom/Loading/Loading";
import {useSelector} from "react-redux";

const SearchUser: React.FC = () => {
    const [current, setCurrent] = useState<number>(1);
    const [searchType, setSearchType] = useState<string>("all");
    const [users, setUsers] = useState<UserType[]>([]);
    const [total, setTotal] = useState<number>(1);
    const [name, setName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: IRootState) => state.user.user);
    const searchOptionsRef = useRef<any>({type: searchType, name, page: 1});
    // const token:any = useToken();

    const debouncedSearch = useDebounce(searchOptionsRef.current, 1000);

    const isSmall: boolean = useMediaQuery({ query: "(max-width: 481px)" });
    // const isMiddle:boolean = useMediaQuery({ query: "(max-width: 768px)" });

    const getSeachResults = () => {
        (async function () {
            setLoading(true);
            const usersData = await handleGQLRequest(searchOptionsRef.current.type == "all" ? "SearchInAll" :
                "SearchInFriends", {page: searchOptionsRef.current.page, name: searchOptionsRef.current.name});
            if (usersData.SearchInAll) {
                if (usersData.SearchInAll.users) {
                    setUsers(usersData.SearchInAll.users.splice(0, 9));
                    setLoading(false)
                } else {
                    setUsers([]);
                    setLoading(false)
                }
                if (usersData.SearchInAll.total) {
                    setLoading(false)
                    setTotal(usersData.SearchInAll.total);
                } else {
                    setTotal(1);
                    setLoading(false)
                }
            } else if (usersData.SearchInFriends) {
                if (usersData.SearchInFriends.users) {
                    setUsers(usersData.SearchInFriends.users.splice(0, 9));
                    setLoading(false)
                } else {
                    setUsers([]);
                    setLoading(false)
                }
                if (usersData.SearchInFriends.total) {
                    setLoading(false)
                    setTotal(usersData.SearchInFriends.total);
                } else {
                    setTotal(1);
                    setLoading(false)
                }
            } else {
                setTotal(1);
                setLoading(false);
            }
        })();
    };

    const search: Function = (e: string) => {
        setName(e);
        const args:any = {
            page: current,
            name: e,
            type: searchType
        }
        searchOptionsRef.current = args;
    };

    const searchChange: Function = (e: any) => {
        setName(e.target.value);
        const args:any = {
            page: current,
            name: e.target.value,
            type: searchType
        }
        searchOptionsRef.current = args;
    };

    const changePage: Function = (e: any) => {
        setCurrent(e);
        const args:any = {
            page: current,
            name: name,
            type: searchType
        }
        searchOptionsRef.current = args;
    };

    const newSearchType: Function = (e: ChangeType) => {
        setSearchType(e.target.value);
        const args:any = {
            page: current,
            name: name,
            type: e.target.value
        }
        searchOptionsRef.current = args;
    };

    useEffect(() => {
        getSeachResults();
    }, [debouncedSearch])

    return (
        <div
            style={{
                width: isSmall ? "100%" : "60%",
                backgroundColor: "green"
            }}
            className={styles.find_user_container}
        >
            {loading && <Loading />}
            <Search
                allowClear={true}
                className={styles.user_search}
                placeholder={searchType == "friends" ? "Search in Friends" : "Search"}
                onChange={(e) => searchChange(e)}
                onSearch={(e) => search(e)}
            />
            <Radio.Group
                onChange={(e) => newSearchType(e)}
                value={searchType}
                className={styles.search_radio}>
                { user.name &&
                <Radio value={"friends"}>Friends</Radio>
                }
                <Radio value={"all"}>All</Radio>
            </Radio.Group>
            <div className={globalStyles.centered_users_cont}>
                <UsersMapper users={users} />
                <Pagination
                    total={total}
                    current={current}
                    onChange={(e) => changePage(e)}
                    showSizeChanger={false} />
            </div>
        </div>
    )
}

export default SearchUser;