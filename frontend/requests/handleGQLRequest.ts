import axios from "axios";
import { query} from "gql-query-builder";

const handleGQLRequest:Function = async (operation:string, args:any) => {
    let variables:any = {};
    let fields:any = [];
   if( operation == "SignIn") {
        const { email, password } = args;
        variables = {
            email: { type: "String!", value: email}, 
            password:  { type: "String!", value: password}
        }    
        fields = ["name", "email"] 
   }
   if(operation == "SignUp") {
     const { image, name, email, password } = args;
     variables = {
         email: { type: "String!", value: email}, 
         password:  { type: "String!", value: password},
         image: { type: "String!", value: image},
         name: { type: "String!", value: name}
     }    
     fields = ["name", "email"] 
   }
   return await axios.post("/graphql",query({
        operation,
        variables: variables,
        fields: fields
        })).then((res) => {
            if(res.data.data) {
                return res.data.data;
            } else if(res.data.errors){
                return res.data.errors[0]
            };
        })
}

export default handleGQLRequest;