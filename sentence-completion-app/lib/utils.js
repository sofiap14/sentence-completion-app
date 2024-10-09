import { getISOWeek } from 'date-fns';

export function getCurrentWeekNumber(date = new Date()) {
  return getISOWeek(date);
}
