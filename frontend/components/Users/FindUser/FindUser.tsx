import { Input, Pagination } from "antd";
import React, { useState }  from "react";
import { useMediaQuery } from "react-responsive";
import { theme } from "antd";

const { useToken } = theme;
const { Search } = Input;

import styles from "../../../styles/Users/FindUser.module.scss";
import UsersMapper from "../UsersList/UsersList"; 
import users from "../../../users";
import globalStyles from "../../../styles/globalClasses.module.scss";
// import UsersPagination from "../UserPagination/UserPagination";

const SearchUser:React.FC = () => {
    const [current, setCurrent] = useState<number>(1);
    // const token:any = useToken();

    const isSmall:boolean = useMediaQuery({ query: "(max-width: 481px)"});
    // const isMiddle:boolean = useMediaQuery({ query: "(max-width: 768px)" });

    const search:Function = (e:string) => {
       console.log(e);
    };

    const searchChange:Function = (e:any) => {
        console.log(e.target.value);
    };

    const changePage:Function = (e:any) => {
        setCurrent(e);
    }

     return (
        <div 
          style={{
             width: isSmall ? "100%": "60%",
             backgroundColor: "green"
          }}
          className={styles.find_user_container}
          >
           <Search 
                allowClear={true}
                className={styles.user_search}
                placeholder="Search in friends"
                onChange={(e) => searchChange(e)}
                onSearch={(e) => search(e)}
                />
            <div className={globalStyles.centered_users_cont}>
                <UsersMapper users={users} />
                <Pagination 
                    total={500} 
                    current={current} 
                    onChange={(e) => changePage(e)}  
                    showSizeChanger={false} />
              </div>
        </div>
    )
}

export default SearchUser;