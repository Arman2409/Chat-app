import { Button, Input, Switch } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useDebounce } from 'use-debounce';
import { useSelector } from "react-redux";
import { BiSearchAlt } from "react-icons/bi"

const { Search } = Input;

import styles from "../../../styles/Parts/FindUser.module.scss";
import UsersMapper from "../../Tools/UsersMapper/UsersMapper";
import { IRootState } from "../../../store/store";
import { UserType } from "../../../types/types";
import handleGQLRequest from "../../../request/handleGQLRequest";

const SearchUser: React.FC = () => {
    const [searchType, setSearchType] = useState<string>("all");
    const [users, setUsers] = useState<UserType[]>([]);
    const [total, setTotal] = useState<number>(1);
    const [name, setName] = useState<string>("");
    const [searchOpened, setSearchOpened] = useState(false);
    const [childPage, setChildPage] = useState(1);
    const [loading, setLoading] = useState<boolean | string>(false);

    const user = useSelector((state: IRootState) => state.user.user);
    const searchOptionsRef = useRef<any>({ type: searchType, name, page: 1 });
    const listType = useMemo(() => searchType, [users])
    const [debouncedSearch] = useDebounce(loading, 1000);

    const isMedium = useMediaQuery({ query: "(max-width: 750px)" });
    const isSmall: boolean = useMediaQuery({ query: "(max-width: 500px)" });

    const getSeachResults = () => {
        (async function () {
            const usersData: any = await handleGQLRequest(searchOptionsRef.current.type == "all" ? "SearchInAll" :
                "SearchInFriends", { page: searchOptionsRef.current.page, name: searchOptionsRef.current.name });

            if (usersData.SearchInAll) {
                if (usersData.SearchInAll.users) {
                    if (typeof debouncedSearch === "string") {
                        setUsers([...usersData.SearchInAll.users]);

                    }
                    else if (usersData.SearchInAll?.users?.length) {
                        setUsers([...users, ...usersData.SearchInAll.users]);
                    };
                } else {
                    setUsers([]);
                }
                if (usersData.SearchInAll.total) {
                    setTotal(usersData.SearchInAll.total);
                } else {
                    setTotal(1);
                }
                setLoading(false)
            } else if (usersData.SearchInFriends) {
                if (usersData.SearchInFriends.users) {
                    if (typeof debouncedSearch === "string") {
                        setUsers([...usersData.SearchInFriends.users]);
                    } else {
                        setUsers([...users, ...usersData.SearchInFriends.users]);
                    }
                } else {
                    setUsers([]);
                }
                if (usersData.SearchInFriends.total) {
                    setTotal(usersData.SearchInFriends.total);
                } else {
                    setTotal(1);
                }
                setLoading(false);

            } else {
                setTotal(1);
                setLoading(false);
            }
        })();
    };

    const search = useCallback((e: string) => {
        setChildPage(1)
        if (e !== name) setName(e);
        if (searchOptionsRef.current.name == e) return;
        const args = {
            type: searchOptionsRef.current.type,
            name: e,
            page: 1
        }
        searchOptionsRef.current = args;
        setLoading(e);
    }, [setLoading, searchOptionsRef, loading, debouncedSearch, name]);

    const searchChange = (e: any) => {
        setChildPage(1);
        if (e !== name) setName(e.target.value);
        if (searchOptionsRef.current.name == e) return;
        const args = {
            type: searchOptionsRef.current.type,
            name: e.target.value,
            page: 1
        }
        searchOptionsRef.current = args;
        setLoading(e.target.value);
    };

    const changePage: Function = useCallback((e: any) => {
        const args: any = {
            page: e,
            name: name,
            type: searchType
        }
        searchOptionsRef.current = args;
        setLoading(e);
    }, [total, users, loading, searchOptionsRef.current, setLoading]);

    const newSearchType: Function = (e: boolean) => {
        const type = (e ? "friends" : "all");
        const args: any = {
            page: 1,
            name: name,
            type
        };
        searchOptionsRef.current = args;
        setLoading(searchType);
        setSearchType(type);
        setChildPage(1);
        setUsers([]);
    };

    useEffect(() => {
        if (debouncedSearch || debouncedSearch === "") {
            getSeachResults();
        };
        if (!debouncedSearch && !loading && name !== searchOptionsRef.current.name) {
            search(name);
        };
        setLoading(false);
    }, [debouncedSearch])

    useEffect(() => {
        searchOptionsRef.current = {
            ...searchOptionsRef.current,
            page: 1
        }
        setLoading("user");
        if (!user.name) {
            newSearchType(false);
        };
        setChildPage(1);
    }, [user]);

    return (
        <div
            style={{
                width: isSmall ? "100%" : isMedium ? "60%" : "50%",
            }}
            className={styles.find_user_container}
        >
            <div 
              className={styles.find_user_container_tools} 
              style={{
                flexDirection: isSmall ? "column" : "row",
              }}>
            <Button
                className={searchOpened ? styles.find_user_open_search_animation : styles.find_user_open_search_initial}
                onClick={() => setSearchOpened(true)}>
                <Search
                    allowClear={true}
                    style={{
                        display: !searchOpened && "none" as any,
                    }}
                    className={styles.user_search}
                    placeholder={searchType == "friends" ? "Search in Friends" : "Search"}
                    onChange={(e) => searchChange(e)}
                    onSearch={(e) => search(e)}
                />
                {!searchOpened && <BiSearchAlt />}
            </Button>
                <Switch
                    checkedChildren="Friends"
                    unCheckedChildren="All"
                    checked={searchType === "friends"}
                    className={styles.search_switch}
                    onChange={(e: boolean) => newSearchType(e)}
                    disabled={user.name ? false : true}
                    defaultChecked={false} />
            </div>

            <div className="centered_users_cont">
                <UsersMapper
                    getUsers={(page: number) => changePage(page)}
                    total={total}
                    users={users}
                    newPage={childPage}
                    loadingSearch={loading}
                    friends={listType === "friends"} />
            </div>
        </div>
    )
}

export default SearchUser;