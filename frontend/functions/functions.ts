export const getSlicedWithDots:Function = (word: string, lettersCOunt: number) => {
  if(word.length <= lettersCOunt) return word;
  return  word.slice(0, lettersCOunt) + "...";
};

export const getSendersId:Function = (array: any[], userId:number) => {
  return array.filter((id: string) => id.toString() !== userId.toString())[0]
}