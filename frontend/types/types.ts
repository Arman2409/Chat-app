import {Reducer} from "@reduxjs/toolkit";

export interface UserType {
    id: number,
    name: string,
    email: string, 
    image: string,
    password?: string,
    friendRequests: any[],
    sentRequests: any[],
    friends: any[],
    active: boolean,
    lastMessage?: string
}

export interface UserInitialState {
  user: UserType
  userWindow: boolean
};

export interface MessagesDataType {
    between: any[],
    sequence: any[],
    messages: any[],
}

export interface  MessagesInitialState {
    interlocutor: UserType,
    messagesData: MessagesDataType
}

export interface Reducers {
    user: Reducer,
    messages: Reducer
};

export interface SignProps {
  type: string,
    changeStatus: Function
}

export interface MapperProps {
  friends?: boolean;
  friendRequests?: boolean;
  lastMessages?: boolean
  accept?:Function;
  users: any[];
}

export interface NewsModalProps {
    news: {
        description: string,
        title: string,
    },
    toggleModal: Function
}