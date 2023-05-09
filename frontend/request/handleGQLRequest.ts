import axios from "axios";
import { query } from "gql-query-builder";
import { perPage } from "../../configs/configs";

const handleGQLRequest: Function = async (operation: string, args?: any) => {
    const userFields = ["name","lastVisited", "friends", "image", "sentRequests", "friendRequests", "email", "active","id"];
    let variables = {};
    let fields: any[] = [];

    if (operation == "SignIn") {
        const { email, password } = args;
        variables = {
            email: { type: "String!", value: email },
            password: { type: "String!", value: password }
        }
        fields = ["token", "message"]
    }

    if (operation == "SignUp") {
        const { image, name, email, password } = args;
        variables = {
            email: { type: "String!", value: email },
            password: { type: "String!", value: password },
            image: { type: "String!", value: image },
            name: { type: "String!", value: name }
        }
        fields = ["name", "email", "id"]
    }

    if (operation == "SearchInAll") {
        const { name, page } = args
        variables = {
            name: { type: "String!", value: name },
            page: { type: "Float!", value: page},
            perPage: { type: "Float!", value: perPage}
        }
        fields = [{"users": userFields}, "total"]
    }

    if(operation == "SearchInFriends") {
        const { name, page } = args
        variables = {
            name: { type: "String!", value: name },
            page: { type: "Float!", value: page},
            perPage: { type: "Float!", value: perPage}
        }
        fields = [{"users": userFields}, "total"]
    }

    if(operation == "GetLastMessages") {
        const { page } = args
        variables = {
            page: {type: "Float!", value: page},
            perPage: {type: "Float!", value: perPage}
        }
        fields = ["total", {"users": [...userFields, "lastMessage", "notSeenCount"]}];
    };

    if(operation == "AddFriend") {
        const {id} = args;
        variables = {
            id: {type: "String!", value: id}
        }
        fields = userFields;
    }


    if(operation == "GetFriendRequestsUsers") {
        const {ids} = args
        variables = {
            ids: { type: "[String!]!", value: ids}
        }
        fields = userFields
    }

    if(operation == "ConfirmFriend") {
        const { friendId } = args;
        variables = {
            friendId: {type: "String!", value: friendId}
        }
        fields = ["token"]
    }

    if(operation == "AlreadySigned") {
        const { token } = args;
        variables = {
            token: {type: "String!", value: token}
        };
        fields = userFields
    }

    if(operation == "GetWelcomeNews") {
        fields = ["description", "title"];
    }

    if(operation == "FindUserById") {
        const { id } = args;
        variables = {
            id: {type: "String!", value: id}
        };
        fields = userFields
    }

    if(operation == "RecoverPassword") {
        const { email } = args;
        variables = {
            email: {type: "String!", value: email}
        };
        fields = ["code", "message", "id"]
    }

    if(operation == "ConfirmRecoveredPassword") {
        const { newPassword, id } = args;
        variables = {
            id: {type: "String!", value: id},
            newPassword: {type: "String!", value: newPassword}
        };
        fields = ["successMessage", "message"]
    }

    return await axios.post("/graphql", query({
            operation,
            variables: variables,
            fields: fields
        })).then((res) => {            
            if (res.data?.data) {
                return res.data?.data;
            } else if (res.data.errors) {
                return res.data.errors[0]
            };
        }).catch((e) => {
            return e;
        });
}

export default handleGQLRequest;