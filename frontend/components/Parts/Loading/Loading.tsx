import { Spin } from "antd";
import styles from "../../../styles/Parts/Loading.module.scss";

const Loading = () => {
   return (
     <div className={styles.loading_cont}>
         <Spin tip="Loading" size="large">
               <div className="content" />
          </Spin>
     </div>
   )
} 

export default Loading;