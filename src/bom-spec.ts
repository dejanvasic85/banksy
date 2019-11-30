import { expect } from 'chai';
import { parseAmount } from './bom';

describe('bom', () => {
  describe('parseAmount', () => {
    it('should return a positive value when credit has value', () => {
      expect(parseAmount('', '$2,000.00')).to.equal(2000);
    });

    it('should return a negative value when debit has value', () => {
      expect(parseAmount('$4.00', '')).to.equal(-4);
    });
  });
});
