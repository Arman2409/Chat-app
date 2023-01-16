import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";

import requestsStyles from "../../../../styles/Custom/Header/Requests/Requests.module.scss";
import {IRootState} from "../../../../store/store";
import Loading from "../../Loading/Loading";
import handleGQLRequest from "../../../../requests/handleGQLRequest";
import UsersMapper from "../../../Users/UsersMapper/UsersMapper";
import {message} from "antd/lib";
const FriendRequests = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    const requests: number[] = useSelector((state: IRootState) => state.user.user.friendRequests);

   useEffect(() => {
       if(requests.length) {
           (async function() {
               const data = await handleGQLRequest("GetFriendRequestsUsers", {ids: requests} );
               console.log(data)
               if (data.GetFriendRequestsUsers) {
                   setUsers(data.GetFriendRequestsUsers);
               } else if(data.message){
                    message.error(data.message);
               } else {
                   message.error("Error Occured")
               }
               setLoading(false)
           })()
       }
   }, [])

    return (
        <div className={requestsStyles.requests_main}>
            {loading  && <Loading />}
            {requests ? requests.length ? <UsersMapper users={users} /> :
                "No requests found": "No requests found"}
        </div>
    )
}

export default FriendRequests;