import { addHours, addMinutes, addSeconds, differenceInMilliseconds, startOfToday } from 'date-fns';

const millisecond = 1;
const second = 1000 * millisecond;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;

export enum TimeUnit {
    Millisecond = millisecond,
    Second = second,
    Minute = minute,
    Hour = hour,
    Day = day,
    Week = week,
}

export class TimeMachine {

    private static timeDelta = 0;

    public static goTo(hours: number, minutes = 0, seconds = 0): void {
        const neededData = addSeconds(addMinutes(addHours(startOfToday(), hours), minutes), seconds);
        this.timeDelta = differenceInMilliseconds(neededData, new Date());
    }

    public static goToFuture(count: number, unit: TimeUnit): void {
        this.timeDelta += count * unit;
    }

    public static goToPast(count: number, unit: TimeUnit): void {
        this.timeDelta -= count * unit;
    }

    public static returnToPresent(): void {
        this.timeDelta = 0;
    }

    public static now(): number {
        return Date.now() + this.timeDelta;
    }

    public static getDate(year: number | string | Date = TimeMachine.now()) {
        return new Date(year);
    }

}
