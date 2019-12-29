import { expect } from 'chai';
import { textContains } from '../src/selenium';

describe('selenium', () => {
  describe('textContains', () => {
    const tests: any[] = [
      { text: '', textToCompare: '', expected: true },
      { text: 'Short Description', textToCompare: 'description', expected: true },
      { text: 'Nothing to see', textToCompare: 'you sure', expected: false },
      { text: 'Date', textToCompare: 'date', expected: true },
    ];

    tests.forEach(testCase => {
      it(`should return ${testCase.expected} for text ${testCase.text} when text is ${testCase.textToCompare}`, () => {
        expect(textContains(testCase.text, testCase.textToCompare)).to.equal(testCase.expected);
      });
    });
  });
});
