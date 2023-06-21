import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RiMenu4Line } from "react-icons/ri";
import { Dropdown } from "antd";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { useOnClickOutside } from "usehooks-ts";

import styles from "../../../styles/Custom/UserDropdown.module.scss";
import { getItems } from "./menuItems";
import handleGQLRequest from "../../../request/handleGQLRequest";
import type { UserDropDownProps } from "../../../types/propTypes";
import useOpenAlert from "../../Tools/hooks/useOpenAlert";
import { setStoreUser } from "../../../store/userSlice";
import { IRootState } from "../../../store/store";

const UserDropdown = ({ type, onClick, openElement, index, isRequested, setButtonsDisabled, isBlocked, user }: UserDropDownProps) => {
    const [openState, setOpenState] = useState<boolean>(false);
    const dropdownRef = useRef<any>();
    const dispatch = useDispatch();
    const socket = useSelector((state: IRootState) => {
        return state.socket.socket;
    });
    const storeUser = useSelector<IRootState>((state) => state.user.user);

    const { setMessageOptions } = useOpenAlert();
    
    const items = useMemo(() => getItems(isBlocked as boolean, isRequested as boolean), [isBlocked, isRequested, getItems]);

    // adding or removing a friend
    const handleAddRemoveFriend = useCallback((type: string) => {
        const { id } = { ...user };
        setButtonsDisabled && setButtonsDisabled(true);
        (async function () {
            if (user.email) {
                let status: any;
                if (type === "add") {
                    status = await handleGQLRequest("AddFriend", { id });
                    if (status?.AddFriend?.email) {
                        setMessageOptions({
                            message: "Request Sent",
                            type: "success"
                        });
                        dispatch(setStoreUser(status.AddFriend));
                    }
                } else if (type === "remove") {
                    status = await handleGQLRequest("RemoveFriend", { friendId: id });
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
                if (status.message) {
                    setMessageOptions({
                        message: status.message,
                        type: "error"
                    });
                } else if (status.errors) {
                    setMessageOptions({
                        message: status.errors[0],
                        type: "error"
                    });
                }

            } else {
                setMessageOptions({
                    message: type === "add" ? "Sign in to add friends" : "Sign in to remove friends",
                    type: "warning"
                });
            }
        })()
    }, [setMessageOptions, user, dispatch, setButtonsDisabled, handleGQLRequest]);

    const handleBlockUser = useCallback(() => {
        const { id }: any = { ...storeUser || {} };
        socket.emit("blockUser", { by: id, user: user.id }, (res: any) => {
            if (res.email) {
                setMessageOptions({
                    type: "success",
                    message: "User Blocked"
                })
                dispatch(setStoreUser(res));
            } else if (typeof (res) === "string") {
                setMessageOptions({
                    type: "warning",
                    message: res
                })
            }
        })
    }, [storeUser, socket, setMessageOptions]);

    const clickIcon = useCallback((e: Event) => {
        e.stopPropagation();
        setOpenState(curr => !curr);
        onClick && onClick(user.email);
    }, [user, openState, onClick, setOpenState])

    const handleUnblockUser = useCallback(() => {
        const { id }: any = { ...storeUser || {} };
        socket.emit("unBlockUser", { by: id, user: user.id }, (res: any) => {
            if (res.email) {
                setMessageOptions({
                    type: "success",
                    message: "User Unblocked"
                });
                dispatch(setStoreUser(res));
            } else if (typeof (res) === "string") {
                setMessageOptions({
                    type: "warning",
                    message: res
                })
            }
        })
    }, [storeUser, socket, setMessageOptions]);

    // calling function depending on the event key 
    const handleMenuClick = useCallback((event: any) => {
        event.domEvent?.stopPropagation();        
        if (event.key === "addFriend") {
            handleAddRemoveFriend("add");
        } else if (event.key === "blockUser") {
            handleBlockUser();
        } else if (event.key === "removeFriend") {
            handleAddRemoveFriend("remove");
        } else if (event.key === "unBlockUser") {
            handleUnblockUser();
        }
    }, [handleBlockUser, handleAddRemoveFriend]);

    //closing the dropdown if any other is being opened
    useEffect(() => {
        if (openElement !== user.email && openState && openElement) {
            setOpenState(false);
        }
    }, [openElement, user, openState]);

    useOnClickOutside(dropdownRef, (e) => {
        if (openElement === user.email) {
            const dropdownLayout = document.getElementsByClassName(`list_item_actions_dropdown_${index}`);
            if(dropdownLayout[0]){
                if(dropdownLayout[0].contains(e.target as any)) {
                    return;
                }
            }
            setOpenState(false);
        };
    });

    return (
        <div ref={dropdownRef} className={styles.dropdown_main_cont}>
            <Dropdown
                trigger={["click"]}
                open={openState}
                overlayClassName={`${styles.list_item_actions_dropdown} list_item_actions_dropdown_${index}` }
                placement="bottomLeft"
                menu={{
                    items: type === "friend" ? items.friends : items.all,
                    onClick: (event) => handleMenuClick({ ...event, id: user.id })
                }}>
                <div
                    className={styles.list_item_actions_icon}
                    onClick={clickIcon as any}>
                    <RiMenu4Line />
                </div>
            </Dropdown>
        </div>
    )
};

export default UserDropdown;