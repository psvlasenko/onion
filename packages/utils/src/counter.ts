interface Params {
    count?: number;
    step?: number;
}

type Next = () => number;

export const counter = ({ count = 0, step = 1 }: Params = {}): Next => {
    let counter = count;

    return () => {
        counter += step;

        return counter;
    };
};
