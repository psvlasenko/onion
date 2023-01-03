import { startOfDay } from 'date-fns';
import { addHours, addMinutes, addWeeks, subDays, subHours } from 'date-fns/fp';
import { pipe } from 'ramda';

export const addHour = addHours(1);
export const subHour = subHours(1);
export const dayAgo = (date: Date) => subDays(1, date);
export const addWeek = addWeeks(1);
export const eightInTheMorning = (date: Date) => addHours(8, startOfDay(date));
export const dayTimeFactory = (startOfDay: () => Date) => (hours: number, minutes = 0): Date => pipe(
    addMinutes(minutes),
    addHours(hours)
)(startOfDay());
