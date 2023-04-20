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

    @Field()
    lastVisited?: string

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
export class  MessageType {
    @Field()
    id:string

    @Field(type => [String])
    between: string[]

    @Field(type => [Number])
    sequence:number[]

    @Field(type => [String])
    messages:string[]

    @Field()
    lastDate:string
}


@ObjectType()
export class RecoverType {
    @Field({nullable: true})
    code?:number

    @Field({ nullable: true})
    message?: string
}