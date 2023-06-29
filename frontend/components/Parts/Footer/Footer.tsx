import React from "react";
import { useMediaQuery } from "react-responsive";
import { Layout, Typography } from "antd";

import styles from "../../../styles/Parts/Footer.module.scss";
import { topCopyright, bottomCopyright } from "../../../configs/textConfigs";

const { Footer } = Layout;

const FooterComp: React.FC = () => {

   const isSmall: boolean = useMediaQuery({ query: "(max-width: 600px)" });

   return (
      <Footer 
        className={styles.footer_cont}
         style={{
            height: isSmall ? "60px" : "80px",
         }}>
         <Typography style={{
            fontSize: isSmall ? "9px" : "15px"
         }}>
            {topCopyright}
         </Typography>
         <Typography>
            {bottomCopyright}
         </Typography>
      </Footer>
   )
};

export default FooterComp;