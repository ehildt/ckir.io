import { textToLines } from './text-to-lines.helper';

describe('textToLines', () => {
  it('splits text into sentences', () => {
    const input = "Hello world! How are you? I'm fine.";
    const expected = ['Hello world!', 'How are you?', "I'm fine."];
    expect(textToLines(input)).toEqual(expected);
  });

  it('trims whitespace from sentences', () => {
    const input = '  Hello world!  How are you?   ';
    const expected = ['Hello world!', 'How are you?'];
    expect(textToLines(input)).toEqual(expected);
  });

  it('removes empty strings', () => {
    const input = 'Hello world!   ';
    const expected = ['Hello world!'];
    expect(textToLines(input)).toEqual(expected);
  });

  it('throws an error on empty string', () => {
    expect(() => textToLines('')).toThrow('Converting text to lines');
  });

  it('throws an error on undefined or null', () => {
    expect(() => textToLines(undefined as any)).toThrow('Converting text to lines');
    expect(() => textToLines(null as any)).toThrow('Converting text to lines');
  });
});
