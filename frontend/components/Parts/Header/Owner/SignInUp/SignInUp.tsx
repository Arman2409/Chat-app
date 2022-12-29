import { Input, Button, Form } from "antd";
import { useEffect, useState } from "react";

import styles from "../../../../../styles/Parts/Header/Owner/SignInUp/SignInUp.module.scss";

interface props {
    type: string
}

const SignInUp: React.FC<props> = ({ type }: props) => {

    const submit: Function = (values:any) => {
        
        const { email, password, repeatPassword} = values;

        if (type == "SignIn") {

        }
        else if (type == "SignUp") {

        } else {
            return;
        }
    };
    

    return (
        <div
            className={styles.sign_main}
            style={{
                height: type == "SignIn" ? "250px" : "420px"
            }}>
            <Form 
              onFinish={(values) => submit(values)} 
              className={styles.sign_form}>
                {type == "SignUp" ?
                    <Form.Item 
                      className={styles.form_item}
                      rules={[{ required: true, min: 5}]} 
                      name="name" >
                        <Input
                            placeholder="Name"
                            className={styles.sign_input} />
                    </Form.Item>
                    : null}
                <Form.Item 
                  rules={[{ required: true, type: "email" }]} 
                  className={styles.form_item}
                  name="email">
                    <Input
                        placeholder="Email"
                        className={styles.sign_input}/>
                </Form.Item>
                <Form.Item 
                 className={styles.form_item}
                  rules={[{ required: true , min: 8}]} 
                  name={"password"}>
                    <Input
                        placeholder="Password"
                        className={styles.sign_input}/>
                </Form.Item>
                {type == "SignUp" ?
                    <Form.Item 
                     className={styles.form_item}
                      rules={[{ required: true , min: 8}]} 
                      name="repeatPassword" >
                        <Input
                            placeholder="Repeat Password"
                            className={styles.sign_input} />
                    </Form.Item>
                    : null}
                <Form.Item 
                  className={styles.form_item_button}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className={styles.sign_button}
                    >
                        {type == "SignIn" ? "Sign In" : "Sign Up"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default SignInUp;