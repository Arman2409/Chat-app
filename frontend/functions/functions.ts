export const getSlicedWithDots:Function = (word: string, lettersCOunt: number) => {
  return  word.slice(0, lettersCOunt) + "...";
};