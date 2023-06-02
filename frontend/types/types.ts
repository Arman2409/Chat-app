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

export interface SignProps {
    type: string,
    changeStatus: Function
}

export interface RecoverProps {
    changeStatus: Function
}

export interface LoadingProps {
    type?: string  
}

export interface MapperProps {
  friends?: boolean,
  newPage? : number,
  getUsers?: Function,
  loadingSearch?: string|boolean,
  total?: number,
  friendRequests?: boolean,
  lastMessages?: boolean
  accept?:Function,
  users: any[],
}

export interface NewsModalProps {
    news: {
        description: string,
        title: string,
    },
    toggleModal: Function
}

export interface TimeStampType {
    min: number,
    sec: number
}

export interface UserDropDownProps {
    type: string,
    user:UserType,
    setButtonsDisabled?: Function,
    isBlocked?: boolean,
    isRequested?: boolean
}