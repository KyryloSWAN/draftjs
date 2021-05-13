import { RawDraftEntity, RawDraftEntityRange } from "draft-js";
import { length } from "stringz";
import emojiRegexRGI from "emoji-regex/es2015/RGI_Emoji";

const removeAllEmojiFromStr = (str: string): string =>
  str.replace(emojiRegexRGI(),"");

export const findAllEmojiInStr = (str: string, entityIndex: number = 0) => {
  const entityMap: { [key: string]: RawDraftEntity } = {};
  const entryRanges: Array<RawDraftEntityRange> = [];
  const matchArr = Array.from(
    str.matchAll(
      emojiRegexRGI()
    )
  ); //?
  let counter = 0;
  if (matchArr.length) {
    matchArr.forEach((item, index) => {
      entityMap[entityIndex + index] = {
        type: "EMOJI",
        mutability: "IMMUTABLE",
        data: { emojiUnicode: item[0] }, //?
      };
      counter++;
      if (item.index !== undefined && item[0].length ) {
        
        entryRanges.push({
          key: index,
          offset: item.index,
          // length: 2,
          length: length(item[0]),
          // length: item[0].length,
          // input: item.input,
        });
      }
    });
  }
 
  return {
    text: removeAllEmojiFromStr(str),
    // text: str,
    entryRanges,
    entityMap,
    counter,
  };
};

// console.log(findAllEmojiInStr("🇺🇦ttt🔔"));
// console.log(findAllEmojiInStr(`😍<a href="http://www.f1.com">1</a>2🔔`)/* .entityMap[1] */);
 /* 
  test regex.exec
  */
/*   let array1;
  while ((array1 = emojiRegexRGI().exec("🇺🇦t🔔")) !== null) {
    console.log(array1)
  } */
// console.log(findAllEmojiInStr("<a href", 5));

