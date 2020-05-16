import { expect } from 'chai';

import { cleanDescription } from '../src/banks/westpac';

describe('westpac', () => {
  describe('cleanDescription', () => {
    it('should remove the direct debit purchase', () => {
      const result = cleanDescription('DEBIT CARD PURCHASE WOOLWORTHS 3802 TAYLOR LAKVI');
      expect(result).to.equal('WOOLWORTHS 3802 TAYLOR LAKVI');
    });

    it('should trim the endings', () => {
      const result = cleanDescription(' WOOLWORTHS 3802 TAYLOR LAKVI  \n');
      expect(result).to.equal('WOOLWORTHS 3802 TAYLOR LAKVI');
    });

    it('should remove AU postfixes', () => {
      const result = cleanDescription('WOOLWORTHS 3802 TAYLOR LAKVI AU');
      expect(result).to.equal('WOOLWORTHS 3802 TAYLOR LAKVI');
    });

    it('should remove AUS postfixes', () => {
      const result = cleanDescription('WOOLWORTHS 3802 TAYLOR LAKVI AUS');
      expect(result).to.equal('WOOLWORTHS 3802 TAYLOR LAKVI');
    });

    it('should remove the DEPOSIT-SALARY text from description', () => {
      const result = cleanDescription('DEPOSIT-SALARY MELBOURNE HEALTH 0534783734');
      expect(result).to.equal('MELBOURNE HEALTH 0534783734');
    });
  });
});
