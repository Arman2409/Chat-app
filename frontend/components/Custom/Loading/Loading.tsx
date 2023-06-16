import React from "react";
import { Spin } from "antd";
import { BoxLoading } from "react-loading-typescript"

import styles from "../../../styles/Custom/Loading.module.scss";
import type { LoadingProps } from "../../../types/propTypes";

const Loading:React.FC<LoadingProps> = ({type}:LoadingProps) => {
   return (
     <div className={styles.loading_cont} style={{
       zIndex: type === "box" ? 8 : 7,
     }}>
         {type === "box" && <div className={styles.loading_cont_box_div}>
             <BoxLoading style={{}} color="" size="large" speed={1}/>
          </div>}
         {!type && <Spin  size="large" delay={0}>
               <div className="content" />
          </Spin>}
     </div>
   )
} 

export default Loading;