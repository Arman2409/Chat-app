import React from "react";

import styles from "../../../styles/Custom/Demo.module.scss";
import {DemoProps} from "../../../types/types";
const Demo:React.FC<DemoProps> = ({ message }:DemoProps) => {
    return (
        <div className={styles.demo_main}>
            {message}
        </div>
    )
}

export default  Demo;