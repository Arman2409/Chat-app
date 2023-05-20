import { Layout, Typography } from "antd";
import React from "react";

import styles from "../../../styles/Parts/Footer.module.scss";
import { useMediaQuery } from "react-responsive";

const { Footer } = Layout;

const FooterComp:React.FC = () => {

   const isSmall: boolean = useMediaQuery({ query: "(max-width: 500px)" });

    return (
        <Footer className={styles.footer_cont} style={{
           height: isSmall ? "60px" : "80px",
        }}>
           <Typography style={{
              fontSize: isSmall ? "9px" : "15px"
           }}>
              { " Copyright © 2000, 2001, 2002, 2007, 2008 Free Software Foundation, Inc. <https://fsf.org/>" }
           </Typography>
           <Typography>
              Ghazaryan Arman 2023
           </Typography>
        </Footer>
    )
};

export default FooterComp;