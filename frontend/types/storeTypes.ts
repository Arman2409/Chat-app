import type {Reducer} from "@reduxjs/toolkit";
import type {UserType, MessagesDataType} from "./types";

export interface  MessagesInitialState {
    interlocutor: UserType,
    messagesData: MessagesDataType,
    notSeenCount: number,
}

export interface UserInitialState {
    user: UserType
};

export interface  WindowInitialState {
    loaded: boolean,
    menuOption: string,
    userWindow: boolean
}

export interface  SocketInitialState {
    socket:any
}

export interface Reducers {
    user: Reducer,
    messages: Reducer,
    socket: any,
    window: Reducer
};
