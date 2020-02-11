import * as moment from 'moment';

export const parseDate = (date: string, format: string): moment.Moment => {
  return moment(date, format);
};

export const parseTextToAmount = (text: string): number => {
  const cleaned = text
    .trim()
    .replace(' ', '')
    .replace('$', '')
    .replace(',', '');

  return parseFloat(cleaned);
};
