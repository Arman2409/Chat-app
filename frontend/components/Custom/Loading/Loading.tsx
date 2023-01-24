import { Spin } from "antd";
import styles from "../../../styles/Custom/Loading.module.scss";

const Loading:React.FC = () => {
   return (
     <div className={styles.loading_cont}>
         <Spin  size="large" delay={0}>
               <div className="content" />
          </Spin>
     </div>
   )
} 

export default Loading;