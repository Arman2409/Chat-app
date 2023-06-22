import { RcFile } from "antd/es/upload";
import { TimeStampType } from "../types/types";

export const getSlicedWithDots = (word: string, lettersCount: number) => {
  if(word?.length <= lettersCount) return word;
  if (typeof word === "string") {
    return word?.slice(0, lettersCount) + "...";
  } else {
    return "...";
  } 
};

export const getSendersId = (array: any[], userId:string) => {
  return array.filter((id: string) => id.toString() !== userId)[0]
}

export const getTimeString = (timestamp:TimeStampType) => {
  let minutes:string, seconds:string;
  if(timestamp.min < 10) {
     minutes = "0" + timestamp.min.toString();
  } else {
    minutes = timestamp.min.toString()
  }
  if(timestamp.sec < 10) {
    seconds = "0" + timestamp.sec.toString();
  } else {
    seconds = timestamp.sec.toString()
  }
  return minutes + " : " + seconds;
};

export const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export const getFilesOriginalName = (message:string) => {
   const fileName = message.slice(message.indexOf("&&") + 2);
   return fileName.slice(0, fileName.indexOf("&&"));
}