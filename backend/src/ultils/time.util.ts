import { format, parseISO, isWithinInterval, addDays, startOfDay, endOfDay, addMonths } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const formatDateTime = (date: Date, timezone: string = 'UTC', formatStr: string = 'yyyy-MM-dd HH:mm:ss') => {
  return format(toZonedTime(date, timezone), formatStr);
};

export const convertToUTC = (date: string, timezone: string): Date => {
  const zonedDate = toZonedTime(parseISO(date), timezone);
  const offsetMs = zonedDate.getTimezoneOffset() * 60000;
  return new Date(zonedDate.getTime() - offsetMs);
};

export const isValidTimeRange = (start: Date, end: Date, workingHours?: { start: number; end: number }) => {
  if (start >= end) return false;
  if (workingHours) {
    const startHour = workingHours.start;
    const endHour = workingHours.end;
    const startOfWorkDay = startOfDay(start).setHours(startHour, 0, 0, 0);
    const endOfWorkDay = endOfDay(start).setHours(endHour, 0, 0, 0);
    return isWithinInterval(start, { start: startOfWorkDay, end: endOfWorkDay }) &&
           isWithinInterval(end, { start: startOfWorkDay, end: endOfWorkDay });
  }
  return true;
};

export const getNextOccurrence = (start: Date, frequency: string, interval: number): Date => {
  switch (frequency) {
    case 'DAILY':
      return addDays(start, interval);
    case 'WEEKLY':
      return addDays(start, interval * 7);
    case 'MONTHLY':
      return addMonths(start, interval); // Usa addMonths para precisão
    case 'YEARLY':
      return addMonths(start, interval * 12); // Aproximação para anos
    default:
      return start;
  }
};