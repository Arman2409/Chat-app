import { UserType } from "./types"

export interface SignProps {
    type: string,
    changeStatus: Function
};

export interface RecoverProps {
    changeStatus: Function
};

export interface LoadingProps {
    type?: string  
}

export interface MapperProps {
    friends?: boolean,
    page? : number,
    getUsers?: Function,
    loadingSearchType?: string|boolean,
    total?: number,
    friendRequests?: boolean,
    lastMessages?: boolean
    accept?:Function,
    users: any[],
    setLoadingSearchType: Function
};

export interface NewsModalProps {
    news: {
        description: string,
        title: string,
    },
    toggleModal: Function
};

export interface UserDropDownProps {
    type: string,
    user:UserType,
    openElement?:string,
    onClick?: Function,
    setButtonsDisabled?: Function,
    isBlocked?: boolean,
    isRequested?: boolean
};

export interface MessagesInputProps {
    setMessageData: Function,
    isBlocked: boolean,
    interlocutor: UserType
}