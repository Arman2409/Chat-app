import { SmileOutlined } from "@ant-design/icons";
import { Input , Button} from "antd";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { useState } from "react";

const { TextArea } = Input;

import messagesStyles from "../../../styles/Chat/MessagesChat/MessagesChat.module.scss";

const MessagesChat:React.FC = () => {
  const [smileStatus, setSmileStatus] = useState(false);

  return (
    <div className={messagesStyles.chat_cont}>
          <div className={messagesStyles.inputs_cont}>
              <TextArea className={messagesStyles.chat_textarea}
              />
              <SmileOutlined
                 size={50}
                className={messagesStyles.smile_icon}
                onClick={() => setSmileStatus(status => !status)}/>
              <Button 
                type="primary"
                className={messagesStyles.send_button} 
                >
                 Send
              </Button>
                {smileStatus ?
                <div className={messagesStyles.emoji_cont}>
                  <EmojiPicker 
                    searchDisabled
                    height={"300px"}/>
                </div> : null}
            </div>
    </div>
  )
};

export default MessagesChat;