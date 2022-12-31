import axios from "axios";
import { query } from "gql-query-builder";
import decode from "jwt-decode";

const handleGQLRequest: Function = async (operation: string, args?: any) => {
    let variables: any = {};
    let fields: any = [];

    if (operation == "SignIn") {
        const { email, password } = args;
        variables = {
            email: { type: "String!", value: email },
            password: { type: "String!", value: password }
        }
        fields = ["token"]
    }

    if (operation == "SignUp") {
        const { image, name, email, password } = args;
        variables = {
            email: { type: "String!", value: email },
            password: { type: "String!", value: password },
            image: { type: "String!", value: image },
            name: { type: "String!", value: name }
        }
        fields = ["name", "email"]
    }

    if (operation == "SearchInAll") {
        const { name, page } = args
        variables = {
            name: { type: "String!", value: name },
            page: { type: "Float!", value: page},
            perPage: { type: "Float!", value: 10}
        }
        fields = [{"users": ["name", "image", "email"]}, "total"]
    }

    if(operation == "SearchInFriends") {
        // console.log(searchInFriends);
        
        return [];
    }

     return await axios.post("/graphql", query({
            operation,
            variables: variables,
            fields: fields
        })).then((res) => {
            console.log(res);
            
            if (res.data.data) {
                if (operation == "SignIn") {
                    localStorage.setItem("token", res.data.data.SignIn.token)
                    return decode(res.data.data.SignIn.token);
                }
                return res.data.data;
            } else if (res.data.errors) {
                return res.data.errors[0]
            };
        }).catch((e) => {
            return e;
        });
}

export default handleGQLRequest;