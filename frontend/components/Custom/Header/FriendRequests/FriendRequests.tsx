import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {message} from "antd/lib";

import requestsStyles from "../../../../styles/Custom/Header/Requests/Requests.module.scss";
import {IRootState} from "../../../../store/store";
import Loading from "../../Loading/Loading";
import handleGQLRequest from "../../../../requests/handleGQLRequest";
import UsersMapper from "../../../Users/UsersMapper/UsersMapper";
import {UserType} from "../../../../types/types";
import { useOnClickOutside} from "usehooks-ts";

const FriendRequests = ({clickOutside}: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<any[]>([]);

    const requestsRef = useRef<any>(null);

    const user: UserType = useSelector((state: IRootState) => state.user.user);

    const accept = async (userId:number) => {
       const confirmStatus = await handleGQLRequest("ConfirmFriend", {friendId: userId});
        console.log(confirmStatus);
        return confirmStatus
    }

   useEffect(() => {
       if(user.friendRequests.length) {
           (async function() {
               const data = await handleGQLRequest("GetFriendRequestsUsers", {ids: user.friendRequests} );
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

    useOnClickOutside( requestsRef, () => {
        clickOutside();
    })

    return (
        <div className={requestsStyles.requests_main} ref={requestsRef}>
            {loading  && <Loading />}
            {user.friendRequests ? user.friendRequests.length ? <UsersMapper accept={accept} friends={true} users={users} /> :
                "No requests found": "No requests found"}
        </div>
    )
}

export default FriendRequests;