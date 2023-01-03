export const wait = (timeout: number = 50): Promise<void> =>
    new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
