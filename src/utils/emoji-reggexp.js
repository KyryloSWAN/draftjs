const emojiRegex = require('emoji-regex/RGI_Emoji.js');
// Note: because the regular expression has the global flag set, this module
// exports a function that returns the regex rather than exporting the regular
// expression itself, to make it impossible to (accidentally) mutate the
// original regular expression.

const text = `
\u{231A}: ⌚ default emoji presentation character (Emoji_Presentation)
`;

const regex = emojiRegex();
let match;
while (match = regex.findAll(text)) {
  const emoji = match; //?
  // console.log(`Matched sequence ${ emoji } — code points: ${ [...emoji].length }`);

}