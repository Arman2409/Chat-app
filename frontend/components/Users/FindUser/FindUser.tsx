import { Input, Pagination, Radio, Switch } from "antd";
import React, {ChangeEvent, useCallback, useEffect, useRef, useState} from "react";
import { useMediaQuery } from "react-responsive";
import { theme } from "antd";
import { useDebounce, useUpdateEffect } from "usehooks-ts";

const { useToken } = theme;
const { Search } = Input;

import styles from "../../../styles/Users/FindUser.module.scss";
import UsersMapper from "../../Custom/UsersMapper/UsersMapper";
import {IRootState} from "../../../store/store";
import { UserType } from "../../../types/types";
import handleGQLRequest from "../../../requests/handleGQLRequest";
import Loading from "../../Custom/Loading/Loading";
import {useSelector} from "react-redux";
import {Simulate} from "react-dom/test-utils";

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

    const debouncedSearch = useDebounce( loading, 1000);

    const isSmall: boolean = useMediaQuery({ query: "(max-width: 481px)" });

    const getSeachResults = () => {
        (async function () {
            // setLoading(true);
            const usersData:any = await handleGQLRequest(searchOptionsRef.current.type == "all" ? "SearchInAll" :
                "SearchInFriends", {page: searchOptionsRef.current.page, name: searchOptionsRef.current.name});
            if (usersData.SearchInAll) {
                if (usersData.SearchInAll.users) {
                    setUsers(usersData.SearchInAll.users);
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
                    setUsers(usersData.SearchInFriends.users);
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
        if (e !== name) setName(e);
        if (loading || debouncedSearch) return;
        if (searchOptionsRef.current.name == e) return;
        const args:any = {
            ...searchOptionsRef.current,
            name: e,
        }
        searchOptionsRef.current = args;
        setLoading(true)
    };

    const searchChange: Function = (e: any) => {
        if (e !== name) setName(e.target.value);
        if (loading || debouncedSearch) return;
        if (searchOptionsRef.current.name == e) return;
        const args:any = {
            ...searchOptionsRef.current,
            name: e.target.value,
        }
        searchOptionsRef.current = args;
        setLoading(true)
    };

    const changePage: Function = (e: any) => {
        setCurrent(e);
        const args:any = {
            page: e,
            name: name,
            type: searchType
        }
        searchOptionsRef.current = args;
        setLoading(true);
    };

    const newSearchType: Function = (e: boolean) => {
        const type = (e ? "friends" : "all");
        setSearchType(type);
        const args:any = {
            page: current,
            name: name,
            type
        }
        searchOptionsRef.current = args;
        setLoading(true);
    };

    useEffect(() => {
        if(debouncedSearch) {
            getSeachResults();
        }
        if(!debouncedSearch && !loading && name !== searchOptionsRef.current.name) {
            search(name);
        }
    }, [debouncedSearch,loading])

    useEffect(() => {
        setLoading(true);
    }, [user]);

    return (
        <div
            style={{
                width: isSmall ? "100%" : "50%",
                backgroundColor: "green"
            }}
            className={styles.find_user_container}
        >
            {loading || debouncedSearch &&
                <Loading  />}
            <Search
                allowClear={true}
                className={styles.user_search}
                placeholder={searchType == "friends" ? "Search in Friends" : "Search"}
                onChange={(e) => searchChange(e)}
                onSearch={(e) => search(e)}
            />
            <Switch
                checkedChildren="Friends"
                unCheckedChildren="All"
                className={styles.search_switch}
                onChange={(e: boolean) => newSearchType(e)}
                disabled={user.name ? false : true}
                defaultChecked={false} />
            <div className="centered_users_cont">
                {searchType == "all" ?   <UsersMapper users={users} />
                     : <UsersMapper users={users} friends={true} /> }
                <Pagination
                    total={total}
                    current={current}
                    className="users_pagination"
                    onChange={(e) => changePage(e)}
                    showSizeChanger={false} />
            </div>
        </div>
    )
}

export default SearchUser;