import { Button, Input, Switch } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
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

    const user = useSelector((state: IRootState) => state.user.user);
    const searchInput = useRef<any>(null);
    const findUserRef = useRef<any>(null);
    const listType = useMemo(() => searchType, [users]);

    const isMedium = useMediaQuery({ query: "(max-width: 750px)" });
    const isSmall: boolean = useMediaQuery({ query: "(max-width: 600px)" });

    const page = useRef<number>(0);

    const getSearchResults = useCallback((pageCount?: number|null, searchString?: string, type?: string) => {
        let currPage = page.current;
        if (pageCount) {
            page.current = pageCount;
            currPage = pageCount;
        } else {
            page.current = page.current += 1;
            currPage = page.current;
        }
        let currentType = type ? type : searchType;
        handleGQLRequest(
            currentType === "all" ? "SearchInAll" : "SearchInFriends",
            {
                name: searchString || name,
                page: searchString ? 1 : currPage
            })
            .then((res: any) => {
                const { SearchInAll, SearchInFriends } = res;
                const data = SearchInAll || SearchInFriends || {};
                const { users: usersData, total } = data;
                if (usersData) {
                    setUsers(currents => {
                       if(currents.length && !searchString && !type) {
                         return [...currents, ...usersData]
                       }
                       return [...usersData]
                    })
                    setTotal(total);
                }
            })
    }, [name, searchType, setTotal, setUsers, page])

    const search = useCallback((str: string) => {
        setName(str);
        getSearchResults(str ? 1 : null, str);
    }, [setName]);

    const searchChange = useCallback((e: any) => {
        setName(e.target.value);
        getSearchResults(e.target.value ? 1 : null, e.target.value);
    }, [setName]);

    const newSearchType = useCallback((type: boolean) => {
        const newType = type ? "friends" : "all";
        setSearchType(newType);
        getSearchResults(1, "", newType);
    }, [setUsers, setSearchType]);

    const clickSearch = useCallback(() => {
        setSearchOpened(true)
        searchInput.current.focus();
        getSearchResults(null, name);
    }, [setSearchOpened, searchInput, name]);

    useEffect(() => {
       getSearchResults();
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
                    className={searchOpened ? styles.user_search : styles.user_search_closed}
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
                <UsersMapper
                    getUsers={getSearchResults}
                    total={total}
                    users={users}
                    friends={listType === "friends"} />
        </div>
    )
}

export default SearchUser;