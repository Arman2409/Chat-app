import { Layout, Typography } from "antd";
import React from "react";

import styles from "../../../styles/Custom/Footer.module.scss";

const { Footer } = Layout;

const FooterComp:React.FC = () => {
    return (
        <Footer className={styles.footer_cont}>
           <Typography>
            Copyright 2022
           </Typography>
        </Footer>
    )
};

export default FooterComp;