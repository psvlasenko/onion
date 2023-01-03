import _ from 'lodash';

type Checker = (value: any) => value is Symbol;

const isSymbol = _.isSymbol as Checker;

export {
    isSymbol,
};
