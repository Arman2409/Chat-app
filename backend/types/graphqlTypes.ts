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

