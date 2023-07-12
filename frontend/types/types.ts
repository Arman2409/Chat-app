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
    lastVisited?:  string,
    lastMessage?: string,
    notSeenCount?: number,
    blockedUsers?: string[],
}

export interface MessagesDataType {
    between: any[],
    messages: any[],
    updated? : boolean,
    notSeen?: any
}

export interface TimeStampType {
    min: number,
    sec: number
}

