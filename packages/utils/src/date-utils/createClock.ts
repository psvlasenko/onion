import { TimeMachine } from './TimeMachine';

const createClock = (isTestingMode: boolean) => {
    const now = () => isTestingMode ? TimeMachine.now() : Date.now();

    const today = () => isTestingMode ? TimeMachine.getDate() : new Date();

    const date = (time: number | string | Date = Date.now()): Date =>
        isTestingMode ? TimeMachine.getDate(time) : new Date(time);

    return { now, today, date }
}

export {
    createClock,
}
