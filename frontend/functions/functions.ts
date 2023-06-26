import { RcFile } from "antd/es/upload";
import { TimeStampType } from "../types/types";

export const getSlicedWithDots = (word: string, lettersCount: number) => {
  if (word?.length <= lettersCount) return word;
  if (typeof word === "string") {
    return word?.slice(0, lettersCount) + "...";
  } else {
    return "...";
  }
};

export const getSendersId = (array: any[], userId: string) => {
  return array.filter((id: string) => id.toString() !== userId)[0]
}

export const getTimeString = (timestamp: TimeStampType) => {
  let minutes: string, seconds: string;
  if (timestamp.min < 10) {
    minutes = "0" + timestamp.min.toString();
  } else {
    minutes = timestamp.min.toString()
  }
  if (timestamp.sec < 10) {
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

export const getFilesOriginalName = (message: string) => {
  if (typeof message === "string") {
    const fileName = message.slice(message.indexOf("&&") + 1);
    return getSlicedWithDots(fileName.slice(0, fileName.indexOf("&&")), 20);
  } else {
    return "(file)";
  }
}

export const downloadBase64File = (filename: string, data: string) => {
  if (!filename || !data) return;
  let link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  let event = new MouseEvent('click');
  link.dispatchEvent(event);
}