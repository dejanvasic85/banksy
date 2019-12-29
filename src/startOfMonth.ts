import * as moment from 'moment';

export const getStartOfMonth = () => {
  const today = moment();
  if (today.month() === 11 && today.year() === 2019) {
    // This is when the monthly reconciling started. Remove this in 2020+
    return moment('2019-12-24T00:00:00+11:00');
  }

  return today.startOf('month');
};
