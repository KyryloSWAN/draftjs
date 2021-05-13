export function generateRandomKey(): string {
  const seenKeys: { [index: string]: any } = {};
  const MULTIPLIER = Math.pow(2, 24);

  let key: string | undefined;
  while (key === undefined || seenKeys.hasOwnProperty(key) || !isNaN(+key)) {
    key = Math.floor(Math.random() * MULTIPLIER).toString(32);
  }

  seenKeys[key] = true;
  return key;
}
