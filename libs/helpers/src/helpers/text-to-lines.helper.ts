/**
 * Splits a text string into an array of trimmed sentences.
 *
 * Sentences are determined by splitting on punctuation marks \
 * (`.`, `?`, `!`) while preserving them using a lookbehind regex.
 *
 * @regex `/(?<=[.?!])/`.
 * @param {string} text - The input text to split into lines.
 * @returns {string[]} An array of non-empty, trimmed sentences.
 * @throws {Error} If the input text is empty or no valid lines are produced.
 *
 * @example
 * textToLines("Hello world! How are you?");
 * // ["Hello world!", "How are you?"]
 */
export function textToLines(text: string): Array<string> {
  const lines = text
    ?.split(/(?<=[.?!])/)
    ?.map((s: string) => s.trim())
    ?.filter(Boolean);

  if (!lines?.length) throw Error('Converting text to lines');
  return lines;
}
