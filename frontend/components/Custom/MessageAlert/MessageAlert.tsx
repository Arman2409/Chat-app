import React from "react";
import {message} from "antd";

const MessageAlert = () => {
    const [messageApi, contextHolder] = message.useMessage()

    const Content = (
        <h1>
            hello
        </h1>
    );

}

export default MessageAlert;