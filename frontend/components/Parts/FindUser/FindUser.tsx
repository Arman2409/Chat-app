import { Input, Pagination, Switch } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState} from "react";
import { useMediaQuery } from "react-responsive";
// import { useDebounce } from "usehooks-ts";
import { useDebounce } from 'use-debounce';

import {useSelector} from "react-redux";

const { Search } = Input;

import styles from "../../../styles/Parts/FindUser.module.scss";
import UsersMapper from "../../Tools/UsersMapper/UsersMapper";
import {IRootState} from "../../../store/store";
import { UserType } from "../../../types/types";
import handleGQLRequest from "../../../request/handleGQLRequest";

const SearchUser: React.FC = () => {
    const [current, setCurrent] = useState<number>(1);
    const [searchType, setSearchType] = useState<string>("all");
    const [users, setUsers] = useState<UserType[]>([]);
    const [total, setTotal] = useState<number>(1);
    const [name, setName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: IRootState) => state.user.user);
    const searchOptionsRef = useRef<any>({type: searchType, name, page: 1});
    const listType = useMemo(() =>  searchType, [users])
    const [debouncedSearch] = useDebounce( loading, 1000);
    const isSmall: boolean = useMediaQuery({ query: "(max-width: 481px)" });

    const getSeachResults = () => {
        (async function () {
            const usersData:any = await handleGQLRequest(searchOptionsRef.current.type == "all" ? "SearchInAll" :
                "SearchInFriends", {page:  searchOptionsRef.current.page, name: searchOptionsRef.current.name});
            console.log("get results", searchOptionsRef.current.page);
            
            if (usersData.SearchInAll) {
                if (usersData.SearchInAll.users) {
                    setUsers([...users , ...usersData.SearchInAll.users]);
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
                    setUsers([...users, ...usersData.SearchInFriends.users]);
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

    const search = useCallback((e: string) => {
        if (e !== name) setName(e);
        if (loading || debouncedSearch) return;
        if (searchOptionsRef.current.name == e) return;
        const args = {
            ...searchOptionsRef.current,
            name: e,
        }
        searchOptionsRef.current = args;
        setLoading(true);
    }, [setLoading, searchOptionsRef, loading, debouncedSearch, name]);

    const searchChange = (e: any) => {
        if (e !== name) setName(e.target.value);
        if (loading || debouncedSearch) return;
        if (searchOptionsRef.current.name == e) return;
        const args:any = {
            ...searchOptionsRef.current,
            name: e.target.value,
        }
        searchOptionsRef.current = args;
        setLoading(true);
    };

    const changePage: Function = useCallback((e: any) => {
        const args:any = {
            page: e,
            name: name,
            type: searchType
        }

        setCurrent(e);
        searchOptionsRef.current = args;
        setLoading(true);
    }, [total, users, loading,  searchOptionsRef.current, setCurrent, setLoading]);

    const newSearchType: Function = (e: boolean) => {
        const type = (e ? "friends" : "all");
        setCurrent(1);
        setSearchType(type);
        const args:any = {
            page: current,
            name: name,
            type
        };
        searchOptionsRef.current = args;
        setLoading(type as any);
        setUsers([]);
    };

    useEffect(() => {
        console.log({debouncedSearch});
        
        if(debouncedSearch) {
            getSeachResults();
        }
        if(!debouncedSearch && !loading && name !== searchOptionsRef.current.name) {
            search(name);
        }
    }, [debouncedSearch])

    useEffect(() => {
        setLoading(true);
        if (user.email) {
           newSearchType(true)
        } else {
           newSearchType(false);
        }
    }, [user]);

    useEffect(() => {
       console.log(loading);
       
    }, [loading])

    return (
        <div
            style={{
                width: isSmall ? "100%" : "50%",
            }}
            className={styles.find_user_container}
        >
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
                checked={searchType === "friends"}
                className={styles.search_switch}
                onChange={(e: boolean) => newSearchType(e)}
                disabled={user.name ? false : true}
                defaultChecked={false} />
              <div className="centered_users_cont">
                 <UsersMapper
                   getUsers={(page:number) => changePage(page)}
                   total={total}
                   users={users} 
                   friends={listType === "friends"}/>
            </div>
        </div>
    )
}

export default SearchUser;