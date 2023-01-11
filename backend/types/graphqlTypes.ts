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


