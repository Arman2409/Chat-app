import { Input, Button, Form, Typography, Upload, message } from "antd";
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { UploadChangeParam } from 'antd/es/upload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from "react";

import handleGQLRequest from "../../../../../requests/handleGQLRequest";

import styles from "../../../../../styles/Custom/Header/Owner/SignInUp/SignInUp.module.scss";
import { setStoreUser } from "../../../../../store/userSlice"; 
import { useDispatch } from "react-redux";
import { SignProps } from "../../../../../types/types";
import { Dispatch } from "@reduxjs/toolkit";
import Loading from "../../../Loading/Loading";
import { socket} from "../../../../Chat/MessagesChat/MessagesChat";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
  
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
 };

const SignInUp: React.FC<SignProps> = ({ compType }: SignProps) => {
    const [message, setMessage] = useState<string>("");
    const [type,setType] = useState(compType);
    const [loading, setLoading] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>("");
    const dispatch:Dispatch = useDispatch();

    const submit: Function = async (values: any) => {

        const { name, email, password, repeatPassword } = values;

        if (type == "SignIn") {
            setLoadingRequest(true)
            const res = await handleGQLRequest("SignIn", { email, password });
            if (res.message) {
                setMessage(res.message);
                return;
            };
            setLoadingRequest(false);
            socket.emit("connected", {id: res.id});
            dispatch(setStoreUser(res));
        }
        else if (type == "SignUp") {
            console.log(repeatPassword, password)
            if(repeatPassword !== password) {
                setMessage("Password must be repeated")
                return;
            }
            setLoadingRequest(true)
            const res = await handleGQLRequest("SignUp", { email, password, name, image:imageUrl });
            if (res.message) {
                setMessage(res.message);
                return;
            };
            socket.emit("newUser", {id: res.id});
            setLoadingRequest(false);
            setMessage("Signed Up!");
            setType("SignIn");
        } else {
            return;
        }
    };

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
          setLoading(true);
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj as RcFile, (url) => {
            setLoading(false);
            setImageUrl(url);
          });
        }
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
                height: type == "SignIn" ? "270px" : "500px"
            }}>
            {loadingRequest && <Loading />}
            <Form
                onFinish={(values) => submit(values)}
                className={styles.sign_form}>
                {type == "SignUp" ?
                    <>
                        <Form.Item
                            className={styles.form_item}
                            name="image" >
                            <Upload
                              name="avatar"
                              listType="picture-card"
                              showUploadList={false}
                              beforeUpload={beforeUpload}
                              onChange={handleChange}
                              className={styles.image_input}
                              >
                                 {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            className={styles.form_item}
                            rules={[{ required: true, min: 5 }]}
                            name="name" >
                            <Input
                                placeholder="Name"
                                className={styles.sign_input} />
                        </Form.Item>
                    </>
                    : null}
                <Form.Item
                    rules={[{ required: true, type: "email" }]}
                    className={styles.form_item}
                    name="email">
                    <Input
                        placeholder="Email"
                        className={styles.sign_input} />
                </Form.Item>
                <Form.Item
                    className={styles.form_item}
                    rules={[{ required: true, min: 8 }]}
                    name={"password"}>
                    <Input
                        placeholder="Password"
                        type="password"
                        className={styles.sign_input} />
                </Form.Item>
                {type == "SignUp" ?
                    <Form.Item
                        className={styles.form_item}
                        rules={[{ required: true, min: 8 }]}
                        name="repeatPassword" >
                        <Input
                            placeholder="Repeat Password"
                            type="password"
                            className={styles.sign_input} />
                    </Form.Item>
                    : null}
                <Typography>
                    {message}
                </Typography>
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