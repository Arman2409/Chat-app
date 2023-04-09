export const getSlicedWithDots:Function = (word: string, lettersCount: number) => {
  if(word?.length <= lettersCount) return word;
  return  word.slice(0, lettersCount) + "...";
};

export const getSendersId:Function = (array: any[], userId:number) => {
  return array.filter((id: string) => id.toString() !== userId.toString())[0]
}