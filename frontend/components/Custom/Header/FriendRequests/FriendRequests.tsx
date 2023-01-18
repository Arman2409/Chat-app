import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {message} from "antd/lib";

import requestsStyles from "../../../../styles/Custom/Header/Requests/Requests.module.scss";
import {IRootState} from "../../../../store/store";
import Loading from "../../Loading/Loading";
import handleGQLRequest from "../../../../requests/handleGQLRequest";
import UsersMapper from "../../../Users/UsersMapper/UsersMapper";
import {UserType} from "../../../../types/types";
import { useOnClickOutside} from "usehooks-ts";
import {Dispatch} from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import {setStoreUser} from "../../../../store/userSlice";

const FriendRequests = ({clickOutside}: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<any[]>([]);

    const requestsRef = useRef<any>(null);

    const user: UserType = useSelector((state: IRootState) => state.user.user);

    const dispatch:Dispatch = useDispatch();

    const getRequests = async () => {
            const data = await handleGQLRequest("GetFriendRequestsUsers", {ids: user.friendRequests} );
            if (data.GetFriendRequestsUsers) {
                setUsers(data.GetFriendRequestsUsers);
            } else if(data.message){
                message.error(data.message);
            } else {
                message.error("Error Occured")
            }
            setLoading(false)
    }

    const accept = async (userId:number) => {
       const confirmStatus = await handleGQLRequest("ConfirmFriend", {friendId: userId});
       if( confirmStatus) {
           if (confirmStatus.ConfirmFriend) {
               if (confirmStatus.ConfirmFriend.token) {
                   const newUser = jwtDecode(confirmStatus.ConfirmFriend.token);
                   dispatch(setStoreUser(newUser));
                   localStorage.setItem("token", confirmStatus.ConfirmFriend.token)
               }
               if (confirmStatus.ConfirmFriend.message) {
                   message.warning(confirmStatus.ConfirmFriend.message);
               }
               if (confirmStatus.ConfirmFriend.errors) {
                   message.warning(confirmStatus.ConfirmFriend.erros[0]);
               }
           }  else {
               return;
           }
       } else {
           return;
       }
    }

   useEffect(() => {
       if(user.friendRequests.length) {
          getRequests();
       }
   }, [user])

    useOnClickOutside( requestsRef, () => {
        clickOutside();
    })

    return (
        <div
            className={requestsStyles.requests_main}
            ref={requestsRef}
            style={!user.friendRequests.length ? {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            } : {}}>
            {loading  && <Loading />}
            {user.friendRequests ? user.friendRequests.length ? <UsersMapper accept={accept} friends={true} users={users} /> :
                "No requests found": "No requests found"}
        </div>
    )
}

export default FriendRequests;