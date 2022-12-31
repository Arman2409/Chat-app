import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class  UserType {
    @Field()
    name: string

    @Field()
    email: string

    @Field()
    password?: string

    @Field()
    image?: string
}

@ObjectType()
export class  TokenType {
    @Field()
    token:string
}

@ObjectType()
export class  SearchType {
    @Field(type => [UserType])
    users: UserType[]

    @Field()
    total: number
}


