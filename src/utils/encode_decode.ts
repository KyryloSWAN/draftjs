import {
  RawDraftContentState,
  RawDraftEntity,
  RawDraftContentBlock,
  RawDraftEntityRange,
  ContentState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import { generateRandomKey } from "./random_key";
import { indexOf, substring, length } from "stringz";

import {
  LINK_TAG_START_SEPARATOR,
  LINK_TAG_END_SEPARATOR,
  LINK_URL_END_SEPARATOR,
  LINK_TAG_EMPTY_SEPARATOR,
  TOKEN_DEFINITION_START_SEPARATOR,
  TOKEN_DEFINITION_END_SEPARATOR,
  // TOKEN_HIDDEN_DISPLAY_SYMBOL,
} from "./tags";
import { emojiOffsetDiff } from "./graphemes";

/*
    encode string to draft-js RawDraftContentState object
    RawDraftContentState object can be transformed into ContentState object by convertFromRaw function
*/
export const encodeLinkString = (str: string): RawDraftContentState => {
  const blockParts = str.split("\n");
  const blocks: Array<RawDraftContentBlock> = [];
  const entityMap: { [key: string]: RawDraftEntity } = {};
  let tagCount = 0;
  for (const blockText of blockParts) {
    let text = blockText;
    let entryRanges: Array<RawDraftEntityRange> = [];


    /* link start*/
    while (indexOf(text, LINK_TAG_START_SEPARATOR) !== -1) {
      const openTagIndex = indexOf(text, LINK_TAG_START_SEPARATOR);
      const closeTagIndex = indexOf(text, LINK_TAG_END_SEPARATOR);
      const urlEndIndex = indexOf(text, LINK_URL_END_SEPARATOR);
      const emptyTagIndex = indexOf(text, LINK_TAG_EMPTY_SEPARATOR);
      const urlLink = substring(
        text,
        openTagIndex + LINK_TAG_START_SEPARATOR.length,
        urlEndIndex
      );
      const textBeforeLink = substring(text, 0, openTagIndex);
      const emojiesOffsetDiff = emojiOffsetDiff(textBeforeLink);

      let linkText: string;

      if (emptyTagIndex !== -1) {
        /* <a href="..."></a> */
        linkText = urlLink;
        text =
          textBeforeLink +
          urlLink +
          substring(text, closeTagIndex + LINK_TAG_END_SEPARATOR.length);
      } else {
        /* <a href="...">...</a> */
        linkText = substring(
          text,
          urlEndIndex + LINK_URL_END_SEPARATOR.length,
          closeTagIndex
        );
        text =
          textBeforeLink +
          substring(
            text,
            urlEndIndex + LINK_URL_END_SEPARATOR.length,
            closeTagIndex
          ) +
          substring(text, closeTagIndex + LINK_TAG_END_SEPARATOR.length);
      }

      entryRanges.push({
        key: tagCount,
        offset: openTagIndex + emojiesOffsetDiff,
        length: length(linkText),
      });

      entityMap[tagCount] = {
        type: "LINK",
        mutability: "MUTABLE",
        data: {
          url: urlLink,
        },
      };

      tagCount++;
    }

    blocks.push({
      type: "unstyled",
      text,
      entityRanges: entryRanges,
      key: generateRandomKey(),
      depth: 0,
      inlineStyleRanges: [],
    });
  }

  return {
    blocks,
    entityMap,
  } as RawDraftContentState;
};

export const decodeContentToStr = (content: ContentState): string => {
  const raw = convertToRaw(content);
  // console.log("raw:", JSON.stringify(raw));
  const { blocks, entityMap } = raw; //?
  const value = blocks
    .map((block) => {
      if (!block.text.trim()) return "\n";
      // debugger;
      const entityRanges = block.entityRanges; //?
      const text = block.text; //?
      let result = ""; //?
      let prevEntityOffset = 0;
      for (const entityRange of entityRanges) {
        //?
        const entityKey = entityRange.key; //?
        const entityType = entityMap[entityKey].type; //?
        const entityOffset = entityRange.offset; //?
        const entityEndOffset = entityRange.offset + entityRange.length; //?
        const linkTitle = text.substr(
          entityOffset,
          entityRange.length //?
        );
        const linkTag =
          LINK_TAG_START_SEPARATOR +
          entityMap[entityKey].data.url +
          LINK_URL_END_SEPARATOR +
          linkTitle +
          LINK_TAG_END_SEPARATOR;
        // debugger;
        const beforeEntityText = text.substring(
          prevEntityOffset,
          entityRange.offset
        ); //?
        switch (entityType) {
          case "TOKEN":
            result =
              result +
              text.substring(prevEntityOffset, entityRange.offset) +
              `${TOKEN_DEFINITION_START_SEPARATOR}${entityMap[entityKey].data.original}${TOKEN_DEFINITION_END_SEPARATOR}`;
            prevEntityOffset = entityRange.offset + 1;
            break;
          case "LINK":
            result = result + beforeEntityText + linkTag;
            prevEntityOffset = entityRange.offset + linkTitle.length;
            break;
          case "EMOJI":
            result =
              result +
              // entityMap[entityKey].data.emojiUnicode.length +
              entityMap[entityKey].data.emojiUnicode; //?
            // prevEntityOffset = entityRange.offset + 1; //?
            prevEntityOffset =
              // entityRange.offset + entityMap[entityKey].data.emojiUnicode.length;
              // entityRange.offset + entityRange.length
              entityRange.offset + 1; //?
            break;
          default:
            break;
        }
      }
      result = result + text.substring(prevEntityOffset, text.length);
      console.log("result:", result);
      return result;
    })
    .join("\n");
  return value;
};

/* // encodeLinkString(`🇺🇦<a href="http://www.f1.com">1</a>2`); //?
const rawContent = encodeLinkString(`🇺🇦t🔔`); //?
// console.log("rawContent:");
console.log(rawContent);
const testContentState = convertFromRaw(rawContent); //?
console.log(decodeContentToStr(testContentState)); //?  */
