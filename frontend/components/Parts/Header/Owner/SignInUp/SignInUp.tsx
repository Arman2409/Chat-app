import { Input, Button, Form, Typography, Upload, message } from "antd";
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { UploadChangeParam } from 'antd/es/upload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from "react";

import handleGQLRequest from "../../../../../requests/handleGQLRequest";

import styles from "../../../../../styles/Parts/Header/Owner/SignInUp/SignInUp.module.scss";
import { UserType } from "../../../../../types/types";

interface props {
    type: string
}

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

const SignInUp: React.FC<props> = ({ type }: props) => {
    const [message, setMessage] = useState<string>("");
    const [user, setUser] = useState<UserType>({ name: "", email: "", image: "" });
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    const submit: Function = async (values: any) => {

        const { name, email, password, repeatPassword } = values;

        if (type == "SignIn") {
            const res = await handleGQLRequest("SignIn", { email, password });
            if (res.message) {
                setMessage(res.message);
                return;
            };
            setUser(res);
        }
        else if (type == "SignUp") {
            const res = await handleGQLRequest("SignUp", { email, password, name, image:imageUrl });
            if (res.message) {
                setMessage(res.message);
                return;
            };
        } else {
            return;
        }
    };

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        console.log(info.file);
        
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
                            //   action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
                        className={styles.sign_input} />
                </Form.Item>
                {type == "SignUp" ?
                    <Form.Item
                        className={styles.form_item}
                        rules={[{ required: true, min: 8 }]}
                        name="repeatPassword" >
                        <Input
                            placeholder="Repeat Password"
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