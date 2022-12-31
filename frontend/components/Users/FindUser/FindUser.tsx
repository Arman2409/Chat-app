import { Input, Pagination, Radio } from "antd";
import React, { ChangeEvent, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { theme } from "antd";
import { useDebounce, useUpdateEffect } from "usehooks-ts";

const { useToken } = theme;
const { Search } = Input;

import styles from "../../../styles/Users/FindUser.module.scss";
import UsersMapper from "../UsersList/UsersList";
// import users from "../../../users";
import globalStyles from "../../../styles/globalClasses.module.scss";
import { ChangeType, SearchOptions, UserType } from "../../../types/types";
import handleGQLRequest from "../../../requests/handleGQLRequest";

const SearchUser: React.FC = () => {
    const [current, setCurrent] = useState<number>(1);
    const [searchType, setSearchType] = useState<string>("friends");
    const [searchOptions, setSearchOptions] = useState<SearchOptions>({ args: ""});
    const [users, setUsers] = useState<UserType[]>([]);
    const [total, setTotal] = useState<number>(1);
    // const token:any = useToken();

    const debouncedSearch = useDebounce(searchOptions,1000);

    const isSmall: boolean = useMediaQuery({ query: "(max-width: 481px)" });
    // const isMiddle:boolean = useMediaQuery({ query: "(max-width: 768px)" });

    const search: Function = (e: string) => {
        console.log(e);
    };

    const searchChange: Function = (e: any) => {
        setSearchOptions({
            args: {
                page: current,
                name: e.target.value
            }
        })
    };

    const changePage: Function = (e: any) => {
        setCurrent(e);
    };

    const newSearchType:Function = (e:ChangeType) => {
       setSearchType(e.target.value);
    };

    useUpdateEffect(() => {
        (async function() {
          const usersData = await handleGQLRequest(searchType == "all" ? "SearchInAll" :
                                           "SearchInFriends", searchOptions.args);
         if(usersData.SearchInAll) {
            if (usersData.SearchInAll.users) {
                setUsers(usersData.SearchInAll.users.splice(0, 9));
            } else {
                setUsers([]);
            }
            if (usersData.SearchInAll.total) {
                console.log(usersData.SearchInAll.total);
                
                setTotal(usersData.SearchInAll.total);
            } else {
                setTotal(100);
            }
         }

        })();
        
    }, [debouncedSearch])

    return (
        <div
            style={{
                width: isSmall ? "100%" : "60%",
                backgroundColor: "green"
            }}
            className={styles.find_user_container}
        >
            <Search
                allowClear={true}
                className={styles.user_search}
                placeholder= {searchType == "friends" ? "Search in Friends" : "Search"}
                onChange={(e) => searchChange(e)}
                onSearch={(e) => search(e)}
            />
            <Radio.Group 
              onChange={(e) => newSearchType(e)} 
              value={searchType}
              className={styles.search_radio}>
                <Radio value={"friends"}>Friend</Radio>
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