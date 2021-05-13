/* import { findWithRegex, StrategyCallback } from "@draft-js-plugins/utils";
import { escapeRegExp, unicodeCharRegex } from "emoji-toolkit";
import { ContentBlock } from "draft-js";

const escapedFind = escapeRegExp(unicodeCharRegex());
const search = new RegExp(
  `<object[^>]*>.*?</object>|<span[^>]*>.*?</span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|(${escapedFind})`,
  "gi"
);

const emojiStrategy = (
  contentBlock: ContentBlock,
  callback: StrategyCallback
): void => {
  findWithRegex(search, contentBlock, callback);
};

export default emojiStrategy;
 */
export {}