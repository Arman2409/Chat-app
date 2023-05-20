import { Input, Button, Form, Typography, Upload } from "antd";
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { UploadChangeParam } from 'antd/es/upload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { last } from "lodash";
import decode from "jwt-decode";

import styles from "../../../../../styles/Parts/Header/Owner/SignInUp/SignInUp.module.scss";
import handleGQLRequest from "../../../../../request/handleGQLRequest";
import { setStoreUser } from "../../../../../store/userSlice";
import { SignProps, UserType } from "../../../../../types/types";
import Loading from "../../../../Custom/Loading/Loading";
import { getSlicedWithDots } from "../../../../../functions/functions";
import { setSocket } from "../../../../../store/socketSlice";
import useOpenAlert from "../../../../Tools/hooks/useOpenAlert";
import { setNotSeenCount } from "../../../../../store/messagesSlice";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {    
    const { setMessageOptions } = useOpenAlert();
    
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        setMessageOptions({
            message:'You can only upload JPG/PNG file!',
            type: "error"
        });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        setMessageOptions({
            message:'Image must smaller than 2MB!',
            type: "error"
        });
    }
    return isJpgOrPng && isLt2M;
};

const SignInUp: React.FC<SignProps> = ({ type, changeStatus }: SignProps) => {
    const [message, setMessage] = useState<string>("");
    const [messageColor, setMessageColor] = useState("red");
    const [loading, setLoading] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>("");
    const dispatch: Dispatch = useDispatch();

    const submit: Function = async (values: any) => {

        const { name, email, password, repeatPassword } = values;

        if (type == "SignIn") {
            setLoadingRequest(true)
            const res = await handleGQLRequest("SignIn", { email, password:"password" });
            let user:UserType = {} as UserType;
            
            if(res.SignIn?.token) {
                user = decode(res.SignIn?.token);
                localStorage.setItem("token", res.SignIn?.token)
            }
            if (!user.email) {
                setMessageColor("red")
                if (res.SignIn?.message) {
                    setMessage(getSlicedWithDots(res.SignIn?.message, 20));
                    setLoadingRequest(false);
                    return;
                };
                if (res.errors) {
                    setMessage(getSlicedWithDots(res.erros[0], 20));
                    setLoadingRequest(false);
                    return;
                };
                setMessage("Not Found");
                setLoadingRequest(false);
                return;
            }
            let socket = io("ws://localhost:4000");
            socket.emit("signedIn", { id: user.id }, (resp:any) => {            
                if (Object.hasOwn(resp, "notSeenCount")) {
                  dispatch(setNotSeenCount(Number(resp?.notSeenCount)));
                }
            }
            );
            dispatch(setSocket(socket));
            setLoadingRequest(false);
            dispatch(setStoreUser(user));
        }
        else if (type == "SignUp") {
            // if(repeatPassword !== password) {
            //     setMessage("Password must be repeated")
            //     return;
            // }
            setLoadingRequest(true)
            const res = await handleGQLRequest("SignUp", { email:name, password:"password", name, image: imageUrl });
            
            if (!res.SignUp?.email) {
                if (res.message) {
                    setMessage(getSlicedWithDots(res.message, 20));
                }
                if (res.errors) {
                     setMessage(getSlicedWithDots(res.erors[0], 20));
                }
                 setMessageColor("red")
                 setLoadingRequest(false);
                 return;
            }
            setLoadingRequest(false);
            setMessage("Signed Up!");
            setMessageColor("green")
            changeStatus();
        } else {
            return;
        }
    };

    const handleChangeImage: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
            const lastFile:any = last(info.fileList);
            getBase64(lastFile.originFileObj as RcFile, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );


    return (
        <div
            className={styles.sign_main}
            style={{
                height: "auto"
            }}>
            {loadingRequest && <Loading />}
            <Form
                onFinish={(values) => submit(values)}
                onChange={() => {
                    if (message) setMessage("");
                }}
                className={styles.sign_form}>
                {type == "SignUp" ?
                    <>
                        <Form.Item
                            className={styles.form_item}
                            name="image">
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                onChange={handleChangeImage}
                                className={styles.image_input}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            className={styles.form_item}
                            // rules={[{ required: true, min: 3 }]}
                            name="name" >
                            <Input
                                placeholder="Name"
                                className={styles.sign_input} />
                        </Form.Item>
                    </>
                    : null}
                <Form.Item
                    // rules={[{ required: true, type: "email" }]}
                    className={styles.form_item}
                    name="email">
                    <Input
                        placeholder="Email"
                        className={styles.sign_input} />
                </Form.Item>
                <Form.Item
                    className={styles.form_item}
                    // rules={[{ required: true, min: 8 }]}
                    name={"password"}>
                    <Input
                        placeholder="Password"
                        type="password"
                        className={styles.sign_input} />
                </Form.Item>
                {type == "SignUp" ?
                    <Form.Item
                        className={styles.form_item}
                        // rules={[{ required: true, min: 8 }]}
                        name="repeatPassword" >
                        <Input
                            placeholder="Repeat Password"
                            type="password"
                            className={styles.sign_input} />
                    </Form.Item>
                    : null}
                <Typography className={styles.sign_message} style={{
                    color: messageColor
                }}>
                    {message}
                </Typography>
                <Form.Item
                    className={styles.form_item}>
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