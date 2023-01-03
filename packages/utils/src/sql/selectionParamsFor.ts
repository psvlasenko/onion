import { isFunction } from 'lodash';

import { columnNameFor } from './columnNameFor';

type FullColumnName = string;
type Alias = string;

type Fn = {
    (tableName: string): (columnName: string, alias?: string) => [FullColumnName, Alias];
    (tableName: string): (columnName: string, aliasFn?: (tableName: string, columnName: string) => string) => [FullColumnName, Alias];
};

export const selectionParamsFor: Fn = (table: string) =>
    (column: string, aliasOrFn: string | ((table: string, column: string) => string) = column): [FullColumnName, Alias] =>
    [columnNameFor(table)(column), isFunction(aliasOrFn) ? aliasOrFn(table, column) : `${aliasOrFn}`];
