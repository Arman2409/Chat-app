import { List, Avatar, Typography, Badge } from "antd";
import React from "react";

interface props {
   users: any[];
}

const UsersMapper:React.FC<props> = ({users}:props) => {
   return (
        <List 
        itemLayout="horizontal"
        dataSource={users}
        style={{
         width: "100%",
         maxWidth: "550px",
        }}
        renderItem={(item) => (
        <List.Item>
            <List.Item.Meta 
            avatar={<Badge dot={item.active ? true :false}>
               <Avatar src={item.image} />
                  </Badge>}
            title={<Typography>{item.name}</Typography> }
            description={`${item.description}`}/>
        </List.Item>
        )}
    >
    </List>
   )
}

export default UsersMapper;