export declare class UserType {
    id?: string;
    name: string;
    email: string;
    password?: string;
    image?: string;
    friends?: any[];
    active?: Boolean;
    friendRequests?: any[];
    sentRequests?: any[];
    notSeenCount?: number;
    lastVisited?: string;
    lastMessage?: string;
}
export declare class TokenType {
    token?: string;
    message?: string;
}
export declare class SearchType {
    users: UserType[];
    total: number;
}
export declare class NewsType {
    title: string;
    description: string;
}
export declare class NotSeenType {
    count?: number;
    by: number;
}
export declare class MessageType {
    between: string[];
    sequence: number[];
    messages: string[];
    lastDate: string;
    notSeen?: NotSeenType;
}
export declare class RecoverType {
    code?: number;
    successMessage?: string;
    id?: string;
    message?: string;
}