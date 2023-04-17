import { Spin } from "antd";
import { BoxLoading } from "react-loading-typescript"

import styles from "../../../styles/Custom/Loading.module.scss";
import { LoadingProps } from "../../../types/types";

const Loading:React.FC<LoadingProps> = ({type}:LoadingProps) => {
   return (
     <div className={styles.loading_cont}>
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