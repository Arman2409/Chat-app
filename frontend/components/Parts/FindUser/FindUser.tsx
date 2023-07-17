import { Button, Input, Switch } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useDebounce } from 'use-debounce';
import { useSelector } from "react-redux";
import { BiSearchAlt } from "react-icons/bi"

const { Search } = Input;

import styles from "../../../styles/Parts/FindUser.module.scss";
import UsersMapper from "../../Custom/UsersMapper/UsersMapper";
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
    const [loading, setLoading] = useState<boolean | string>("initial");

    const searchOptionsRef = useRef<any>({ type: searchType, name, page: 1, lastPage: 0});
    const user = useSelector((state: IRootState) => state.user.user);
    const searchInput = useRef<any>(null);
    const findUserRef = useRef<any>(null);
    const [debouncedSearch] = useDebounce(loading, 1000);
    const listType = useMemo(() => searchType, [users]);

    const isMedium = useMediaQuery({ query: "(max-width: 750px)" });
    const isSmall: boolean = useMediaQuery({ query: "(max-width: 600px)" });

    const getSeachResults = useCallback(() => {
        setLoading("");
        const {page, lastPage} = searchOptionsRef.current;
        if(debouncedSearch.toString().startsWith("newPage") && page === lastPage){
            return;
        } 
        (async function () {
            const usersData: any = await handleGQLRequest(searchOptionsRef.current.type == "all" ? "SearchInAll" :
                "SearchInFriends", { page: searchOptionsRef.current.page, name: searchOptionsRef.current.name });
            if (usersData.SearchInAll) {
                if (usersData.SearchInAll?.users) {
                   if(debouncedSearch.toString().startsWith("newPage")) {
                    setUsers([...users, ...usersData.SearchInAll.users]);
                   } else {
                    setUsers([...usersData.SearchInAll.users])
                   }
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
                    if(debouncedSearch.toString().startsWith("newPage")) {
                        setUsers([...users, ...usersData.SearchInFriends.users]);
                       } else {
                        setUsers([...usersData.SearchInFriends.users])
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
            setChildPage(page);
            searchOptionsRef.current.lastPage = searchOptionsRef.current.page;
        })();
    }, [ setTotal, debouncedSearch, users, searchOptionsRef, setUsers, handleGQLRequest]);

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
        if (e !== name) setName(e.target.value);
        if (searchOptionsRef.current.name == e) return;
        const args = {
            type: searchOptionsRef.current.type,
            name: e.target.value,
            page: 1
        }
        searchOptionsRef.current = args;
        setLoading(e.target.value);
        setChildPage(1);
    };

    const newSearchType = useCallback((e: boolean) => {
        const type = (e ? "friends" : "all");
        const args: any = {
            page: 1,
            name: name,
            type
        };
        searchOptionsRef.current = args;
        setLoading(type);
        setSearchType(type);
        setChildPage(1);
    }, [setUsers, setChildPage, setSearchType, setLoading, searchOptionsRef]);

    const clickSearch = useCallback(() => {
        setSearchOpened(true)
        searchInput.current.focus();
    }, [setSearchOpened, searchInput]);

    useEffect(() => {
        if (debouncedSearch || debouncedSearch === "") {
            if(debouncedSearch === "gotUsers") {
                return;
            }
            if(debouncedSearch.toString().startsWith("newPage")) {
                searchOptionsRef.current.page = searchOptionsRef.current.page + 1;
            }
            getSeachResults();
        };
        if (!debouncedSearch && !loading && name !== searchOptionsRef.current.name) {
            search(name);
        };
    }, [debouncedSearch])

    useEffect(() => {
        setChildPage(1);
        searchOptionsRef.current.page = 1;
        getSeachResults();
    }, [user]);

    useEffect(() => {
      getSeachResults();
    }, [])

    return (
        <div
            style={{
                width: isSmall ? "100%" : isMedium ? "60%" : "50%",
            }}
            ref={findUserRef}
            className={styles.find_user_container}
        >
            <div 
              className={styles.find_user_container_tools} 
              style={{
                flexDirection: isSmall ? "column" : "row",
              }}>
            <Search
                    allowClear={true}
                    style={{
                        width: searchOpened ? "250px" : "0px",
                    }}
                    ref={searchInput}
                    className={ searchOpened ? styles.user_search :  styles.user_search_closed }
                    placeholder={searchType == "friends" ? "Search in Friends" : "Search"}
                    onChange={(e) => searchChange(e)}
                    onSearch={(e) => search(e)}
                />
                 <Button
                className={searchOpened ? styles.find_user_open_search_animation : styles.find_user_open_search_initial}
                onClick={clickSearch}
                style={{
                    width: searchOpened ? "0px" : "40px",
                }}>
                
                 <BiSearchAlt />
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
                    getUsers={() => {}}
                    total={total}
                    users={users}
                    parentElementRef={findUserRef}
                    page={childPage}
                    loadingSearchType={loading}
                    setLoadingSearchType={setLoading}
                    friends={listType === "friends"} />
            </div>
        </div>
    )
}

export default SearchUser;