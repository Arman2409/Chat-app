import { ChangeEvent } from "react"
import {Reducer} from "@reduxjs/toolkit";

export interface UserType {
    id: number,
    name: string,
    email: string, 
    image: string,
    password?: string,
    friendRequests: any[],
    friends: any[],
    active: boolean
}

export interface UserInitialState {
  user: UserType
  userWindow: boolean
};

export interface  MessagesInitialState {
    interlocutor: UserType
}

export interface Reducers {
    user: Reducer,
    messages: Reducer
};

export interface SignProps {
  type: string,
    changeStatus: Function
}

export type ChangeType = ChangeEvent & {target: {value: any}}

export interface SearchOptions {
  args: any
}

export interface MapperProps {
  users: any[];
  friends?: boolean;

  accept?:Function;
}

export interface  DemoProps {
    message: string,

}