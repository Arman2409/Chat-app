export const getSlicedWithDots:Function = (word: string, lettersCOunt: number) => {
  if(word.length <= lettersCOunt) return word;
  return  word.slice(0, lettersCOunt) + "...";
};