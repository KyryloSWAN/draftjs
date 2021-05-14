import GraphemeSplitter from "grapheme-splitter";
import { length } from "stringz";

export type EmojiEntry = {
  // id: number; // может и не нужен, поскольку дублируется с номером эл-та массива
  // offset: number;
  // symbol: string;
  lengthJS: number; // symbol.length
  lengthZ: number; // stringz.length(symbol)
  customOffset: number;
};

/*
  getEmojiesFromStr extracts all emoji enties, calculate each emoji length and offset modifier for draft-js
*/
export const getEmojiesFromStr = (str: string): EmojiEntry[] => {
  /* 
    emojiArr
    contains all entries of emojis in text
    each entry contains:
    - lengthJS = symbol.length
    - lengthZ = stringz.length(symbol)
    - customOffset = additional offset modifier for draft-js editor state
  */
  const emojiArr: EmojiEntry[] = [];
 
  const splitter = new GraphemeSplitter();
  const splitArr: string[] = splitter.splitGraphemes(str);

  // let counter = 0;

  splitArr.forEach((element, index) => {
    const lengthJS = element.length;
    let customOffset = 0;
    if (lengthJS === 6) customOffset = 2;

    if (lengthJS !== length(element)) {
      emojiArr.push({
        // id: counter,
        // offset: index,
        // symbol: element,
        lengthJS,
        lengthZ: length(element),
        customOffset,
      });
      // counter++;
    }
  });
  return emojiArr;
};

/*
  getEmojiesFromStr calculate emoji offset modifier for draft-js entityRange offset field
*/
export const emojiOffsetDiff = (str: string): number => {
  const emojisArr: EmojiEntry[] = getEmojiesFromStr(str);
  
  if (!emojisArr.length) return 0;

  let lengthDiff = 0;

  emojisArr.forEach((element) => {
    if (element.lengthJS > 2)
    lengthDiff = lengthDiff + element.lengthZ + element.customOffset;
  })
  
  return lengthDiff;
}
