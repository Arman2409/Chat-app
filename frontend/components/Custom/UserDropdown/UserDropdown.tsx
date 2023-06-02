import React, {useCallback} from "react";
import {RiMenu4Line} from "react-icons/ri";
import {Dropdown} from "antd";
import {useDispatch, useSelector} from "react-redux";
import jwtDecode from "jwt-decode";

import {getItems} from "./menuItems";
import styles from "../../../styles/Custom/UserDropdown.module.scss";
import handleGQLRequest from "../../../request/handleGQLRequest";
import {UserDropDownProps} from "../../../types/types";
import useOpenAlert from "../../Tools/hooks/useOpenAlert";
import {setStoreUser} from "../../../store/userSlice";
import {IRootState} from "../../../store/store";

const UserDropdown = ({type, isRequested, setButtonsDisabled, isBlocked, user }:UserDropDownProps) => {
    const dispatch = useDispatch();
    const socket = useSelector((state: IRootState) => {
        return state.socket.socket;
    });
    const storeUser = useSelector<IRootState>((state) => state.user.user);

    const { setMessageOptions } = useOpenAlert();

    const items = getItems(isBlocked as boolean, isRequested as boolean);
    
    const handleAddRemoveFriend = useCallback((type:string) => {
        const {id} = {...user};
        setButtonsDisabled && setButtonsDisabled(true);
        (async function () {
            if (user.email) {
                let status:any;
                if(type === "add") {
                    status = await handleGQLRequest("AddFriend", {id});    
                    if (status?.AddFriend?.email) {
                        setMessageOptions({
                            message: "Request Sent",
                            type: "success"
                        });
                        dispatch(setStoreUser(status.AddFriend));
                    } 
                } else if (type === "remove") {
                    status = await handleGQLRequest("RemoveFriend", {friendId: id});    
                    if (status.RemoveFriend.token) {
                        const newUser = jwtDecode(status.RemoveFriend?.token);
                        dispatch(setStoreUser(newUser));
                        localStorage.setItem("token", status.RemoveFriend.token);
                        setMessageOptions({
                            message: "Friend Removed",
                            type: "success"
                        });
                    } else {
                        status = status.RemoveFriend;
                    }
                    
                }
                if(status.message) {
                    setMessageOptions({
                        message: status.message,
                        type: "error"
                    });
                } else if(status.errors) {
                    setMessageOptions({
                        message: status.errors[0],
                        type: "error"
                    });
                }
                
            } else {
                setMessageOptions({
                    message: type === "add" ?  "Sign in to add friends" : "Sign in to remove friends",
                    type: "warning"
                });
            }
        })()
    }, [setMessageOptions, user, dispatch, setButtonsDisabled, handleGQLRequest]);

    const handleBlockUser = useCallback(() => {
       const {id}:any = {...storeUser || {}};
       socket.emit("blockUser", {by: id, user:user.id}, (res:any) => {     
        if(res.email) {     
            setMessageOptions({
                type: "success",
                message: "User Blocked"
            })
            dispatch(setStoreUser(res));
        } else if (typeof(res) === "string") {
            setMessageOptions({
                type: "warning",
                message: res
            })
        }
       })
    }, [storeUser, socket, setMessageOptions]);

    const handleUnblockUser = useCallback(() => {
        const {id}:any = {...storeUser || {}};
        socket.emit("unBlockUser", {by: id, user:user.id}, (res:any) => {            
           if (res.email) {
             setMessageOptions({
                 type: "success",
                 message: "User Unblocked"
             });
            dispatch(setStoreUser(res));
         } else if (typeof(res) === "string") {
            setMessageOptions({
                type: "warning",
                message: res
            })
        }
        })
     }, [storeUser, socket, setMessageOptions]);

    const handleMenuClick = useCallback((event:any) => {
        event.domEvent?.stopPropagation();
        if(event.key === "addFriend") {
          handleAddRemoveFriend("add");
        } else if (event.key === "blockUser")  {
          handleBlockUser();
        } else if (event.key === "removeFriend")  {
            handleAddRemoveFriend("remove");
        } else if (event.key === "unBlockUser") {
           handleUnblockUser();
        } 
      }, [handleBlockUser, handleAddRemoveFriend]);

    return (
        <Dropdown
        trigger={["click"]}
        menu={{
             items: type === "friend" ? items.friends : items.all,
             onClick:(event) => handleMenuClick({...event, id:user.id})
        }} 
        overlayClassName={styles.list_item_actions_dropdown}
        placement="bottomRight">
            <div
             className={styles.list_item_actions_icon} 
              onClick={(e) => e.stopPropagation()}>
                 <RiMenu4Line />
              </div>
        </Dropdown>
    )
};

export default UserDropdown;