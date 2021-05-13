import { RawDraftEntity, RawDraftEntityRange } from "draft-js";
import { length } from "stringz";
import emojiRegexRGI from "emoji-regex/es2015/RGI_Emoji";
import emojiRegexText from "emoji-regex/es2015/text";
const emojiRegex = new RegExp(
  // /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu
  // (?:[\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|(?:\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6]|\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0]))/gu
  /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
);

const removeAllEmojiFromStr = (str: string): string =>
  // str.replace(emojiRegex, "");
  // str.replace(emojiRegexRGI(),"");
  str.replace(emojiRegexText(), "");

export const findAllEmojiInStr = (str: string, entityIndex: number = 0) => {
  const entityMap: { [key: string]: RawDraftEntity } = {};
  const entryRanges: Array<RawDraftEntityRange> = [];
  const matchArr = Array.from(
    str.matchAll(
      // emojiRegexRGI()
      emojiRegexText()
      // emojiRegex
    )
  ); //?
  let counter = 0;
  if (matchArr.length) {
    matchArr.forEach((item, index) => {
      entityMap[entityIndex + index] = {
        type: "EMOJI",
        mutability: "IMMUTABLE",
        data: { emojiUnicode: item[0] },
      };
      if (item.index !== undefined) {
        counter++;
        /* const offsetByItemIndex = item.index;
        let correctOffset = 0; */
        if (item.index !== -1) {
          /* if (offsetByItemIndex === 0) {
            entryRanges.push({
              key: index,
              offset: 0,
              // length: item[0].length,
              length: length(item[0]),
              // length: 1,
              // length: correctLength
            });
          } else { */
          if (item[0].length !== length(item[0])) {
            // when emoji double unicode present
            entryRanges.push(
              {
                key: index,
                offset: item.index,
                length: length(item[0]),
              },
              {
                key: index,
                offset: item.index,
                length: length(item[0]),
              }
            );
          } else {
            entryRanges.push({
              key: index,
              offset: item.index,
              // length: item[0].length,
              length: length(item[0]),
              // length: 1,
              // length: correctLength
            });
          }
        }
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

console.log(findAllEmojiInStr("🇺🇦t🔔"));
/* 
  test regex.exec
  */
/*   let array1;
  while ((array1 = emojiRegexRGI().exec("🇺🇦t🔔")) !== null) {
    console.log(array1)
  } */
// console.log(findAllEmojiInStr("<a href", 5));
