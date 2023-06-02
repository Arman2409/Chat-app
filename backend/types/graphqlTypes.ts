import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class  UserType {
    @Field()
    id?: string

    @Field()
    name: string

    @Field()
    email: string

    @Field()
    password?: string

    @Field()
    image?: string

    @Field(type => [String])
    friends?: any[]

    @Field()
    active?: Boolean

    @Field(type => [String])
    friendRequests?: any[]

    @Field(type => [String])
    sentRequests?: any[]

    @Field({nullable: true})
    notSeenCount?: number

    @Field()
    lastVisited?: string

    @Field(type => [String])
    blockedUsers?: any[]

    @Field({ nullable: true})
    lastMessage?: string
}

@ObjectType()
export class  TokenType {
    @Field({nullable: true})
    token?:string

    @Field({nullable: true})
    message?: string
}

@ObjectType()
export class  SearchType {
    @Field(type => [UserType], {nullable: true})
    users: UserType[]

    @Field()
    total: number
}

@ObjectType()
export class NewsType {
    @Field()
    title: string

    @Field()
    description: string
}

@ObjectType()
export class NotSeenType {
    @Field()
     count?: number
       
     @Field()
     by: number
}


@ObjectType()
export class  MessageType {
    @Field(type => [String])
    between: string[]

    @Field(type => [Number])
    sequence:number[]

    @Field(type => [String])
    messages:string[]

    @Field()
    lastDate:string

    @Field()
    notSeen?: NotSeenType

    @Field()
    blocked?: boolean
}


@ObjectType()
export class RecoverType {
    @Field({nullable: true})
    code?:number

    @Field({nullable: true})
    successMessage?:string

    @Field({nullable: true})
    id?:string

    @Field({ nullable: true})
    message?: string
}