import {Reducer} from "@reduxjs/toolkit";

export interface UserType {
    id: string,
    name: string,
    email: string, 
    image: string,
    password?: string,
    friendRequests: any[],
    sentRequests: any[],
    friends: any[],
    active: boolean,
    lastMessage?: string,
    notSeenCount?: number,
    blockedUsers?: string[],
}

export interface UserInitialState {
  user: UserType
};

export interface MessagesDataType {
    between: any[],
    sequence: any[],
    messages: any[],
    lastDate: string,
}

export interface  MessagesInitialState {
    interlocutor: UserType,
    messagesData: MessagesDataType,
    interlocutorMessages: MessagesDataType,
    notSeenCount: number
}

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

export interface TimeStampType {
    min: number,
    sec: number
}

