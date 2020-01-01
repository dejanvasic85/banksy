import { getStartOfMonth } from '../src/startOfMonth';
import { expect } from 'chai';

describe('startOfMonth', () => {
  it('returns the start of month', () => {
    expect(getStartOfMonth()).not.to.be.null;
  });
});
