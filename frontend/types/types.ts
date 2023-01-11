import { ChangeEvent } from "react"

export interface UserType {
    name: string,
    email: string, 
    image: string,
    password?: string,
}

export interface InitialState {
  user: UserType
  userWindow: boolean
};

export interface SignProps {
  compType: string
}

export type ChangeType = ChangeEvent & {target: {value: any}}

export interface SearchOptions {
  args: any
}

export interface MapperProps {
  users: any[];
  friends?: boolean
}