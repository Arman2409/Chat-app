import { Layout, Typography } from "antd";
import React from "react";

import styles from "../../../styles/Parts/Footer.module.scss";

const { Footer } = Layout;

const FooterComp:React.FC = () => {
    return (
        <Footer className={styles.footer_cont}>
           <Typography>
              { " Copyright © 2000, 2001, 2002, 2007, 2008 Free Software Foundation, Inc. <https://fsf.org/>" }
           </Typography>
           <Typography>
              Ghazaryan Arman 2023
           </Typography>
        </Footer>
    )
};

export default FooterComp;