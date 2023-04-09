import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {message} from "antd/lib";

import requestsStyles from "../../../../styles/Custom/Header/Requests/Requests.module.scss";
import {IRootState} from "../../../../store/store";
import Loading from "../../Loading/Loading";
import handleGQLRequest from "../../../../requests/handleGQLRequest";
import UsersMapper from "../../UsersMapper/UsersMapper";
import {UserType} from "../../../../types/types";
import { useOnClickOutside} from "usehooks-ts";
import {Dispatch} from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import {setStoreUser} from "../../../../store/userSlice";
import useOpenAlert from "../../../../hooks/useOpenAlert";

const FriendRequests = ({clickOutside}: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<any[]>([]);

    const requestsRef = useRef<any>(null);
    const user: UserType = useSelector((state: IRootState) => state.user.user);
    const dispatch:Dispatch = useDispatch();
    const { setMessageOptions } = useOpenAlert();

    const getRequests = async () => {
            const data = await handleGQLRequest("GetFriendRequestsUsers", {ids: user.friendRequests} );
            if (data.GetFriendRequestsUsers) {
                setUsers(data.GetFriendRequestsUsers);
            } else if(data.GetFriendRequestsUsers?.message){
                setMessageOptions({
                    message: data.message,
                    type: "error"
                });
            } else if (data.erros) {
                setMessageOptions({
                    message: data.errors[0],
                    type: "error"
                });
            } else {
                setMessageOptions({
                    message:"Error Occured" ,
                    type: "error"
                });
            }
            setLoading(false)
    }

    const accept = async (userId:number) => {
       const confirmStatus = await handleGQLRequest("ConfirmFriend", {friendId: userId});
       if( confirmStatus) {
           if (confirmStatus.ConfirmFriend) {
               if (confirmStatus.ConfirmFriend.token) {
                   const newUser = jwtDecode(confirmStatus.ConfirmFriend?.token);
                   dispatch(setStoreUser(newUser));
                   localStorage.setItem("token", confirmStatus.ConfirmFriend.token)
               }
               if (confirmStatus.ConfirmFriend?.message) {
                setMessageOptions({
                    message:confirmStatus.ConfirmFriend?.message,
                    type: "warning"
                })
               }
               if (confirmStatus.ConfirmFriend?.errors) {
                setMessageOptions({
                    message:confirmStatus.ConfirmFriend.erros[0],
                    type: "warning"
                })
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
          setLoading(true);
       }
   }, [user])

    useOnClickOutside( requestsRef, (e) => {
        clickOutside(e);
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
            {user.friendRequests?.length ? 
             <UsersMapper friendRequests={true}
              accept={accept} 
              friends={true} 
              users={users} /> :
                 <p className={requestsStyles.requests_main_not_found}>No requests found</p>}
        </div>
    )
}

export default FriendRequests;