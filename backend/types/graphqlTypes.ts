import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class  UserType {
    @Field()
    id?: number 

    @Field()
    name: string

    @Field()
    email: string

    @Field()
    password?: string

    @Field()
    image?: string

    @Field(type => [Number])
    friends?: number[]

    @Field()
    active?: Boolean

    @Field(type => [Number])
    friendRequests?: number[]

    @Field(type => [Number])
    sentRequests?: number[]

    @Field()
    lastVisited?: string

    @Field({ nullable: true})
    lastMessage?: string
}

@ObjectType()
export class  TokenType {
    @Field()
    token:string
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
export class  MessageType {
    @Field()
    id:number

    @Field(type => [Number])
    between: number[]

    @Field(type => [Number])
    sequence:number[]

    @Field(type => [String])
    messages:string[]

    @Field()
    lastDate:string
}