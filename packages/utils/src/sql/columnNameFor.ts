export const columnNameFor = <T extends string = string>(table: string) => (column: T) => `"${table}"."${column}"`;
