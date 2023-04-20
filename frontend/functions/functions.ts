import { TimeStampType } from "../types/types";

export const getSlicedWithDots = (word: string, lettersCount: number) => {
  if(word?.length <= lettersCount) return word;
  return  word.slice(0, lettersCount) + "...";
};

export const getSendersId = (array: any[], userId:number) => {
  return array.filter((id: string) => id.toString() !== userId.toString())[0]
}

export const getTimeString = (timestamp:TimeStampType) => {
  let minutes:string, seconds:string;
  if(timestamp.min < 10) {
     minutes = "0" + timestamp.min.toString();
  } else {
    minutes = timestamp.min.toString()
  }
  if(timestamp.sec < 10) {
    seconds = "0" + timestamp.min.toString();
  } else {
    seconds = timestamp.sec.toString()
  }
  return minutes + " : " + seconds;
}