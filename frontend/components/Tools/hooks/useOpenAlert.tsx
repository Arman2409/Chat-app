import { useEffect, useRef, useState } from "react";
import { message } from "antd";

const useOpenAlert = () => {
    const [messageOptions, setMessageOptions] = useState<any>({});
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const timeoutRef = useRef<any>(null);
    
    const openMessage = ({message: string, type}:any) => {
       if (!string) return;
       if (isOpen) message.destroy();
       setIsOpen(true);
       if(type == "error") {
          message.error(string, 1)
       }
       if(type == "warning") {
         message.warning(string, 1);
       }
       if(type == "success") {
        message.success(string, 1);
      }
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
           setIsOpen(false);
         }, 1000)
    }

    useEffect(() => {
        if(!messageOptions?.message) return;
        openMessage(messageOptions);
    }, [messageOptions])

    return {setMessageOptions};
}

export default useOpenAlert;