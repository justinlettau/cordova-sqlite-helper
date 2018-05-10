import { isArray, isBoolean, isDate, isUndefined } from 'ts-util-is';

import { SqliteNamedParams, SqlitePrepareResult } from './interfaces';

/**
 * Regex to find named parameters. Example: `@exampleId`.
 */
const NAMED_PARAM: RegExp = /@([\w]+)/ig;

/**
 * Safely transform named parameters and unsupported data types.
 *
 * @param sql Sql statement to be prepared.
 * @param params Named parameter object.
 */
export default function prepare(sql: string, params: SqliteNamedParams): SqlitePrepareResult {
  let match: RegExpExecArray;
  let parameters: any[] = [];
  const multiValues: any[] = [];

  // tslint:disable-next-line:no-conditional-assignment
  while ((match = NAMED_PARAM.exec(sql)) !== null) {
    let value: any = params[match[1]];

    // array --> list (example: `where in (?, ?, ?)`)
    if (isArray(value)) {

      // remove duplicates
      value = value.filter((item, index, self) => self.indexOf(item) === index);

      // add multiple values
      parameters = parameters.concat(value);

      // add to multi-values
      multiValues.push([match[0], value.map(x => '?').join(',')]);
      continue;
    }

    // undefined --> null (prevents error on Windows platform)
    if (isUndefined(value)) {
      value = null;
    }

    // boolean -> bit
    if (isBoolean(value)) {
      value = value ? 1 : 0;
    }

    // date -> string
    if (isDate(value)) {
      value = value.toISOString();
    }

    // add single value
    parameters.push(value);
  }

  // add `?` param for each value in arrays
  for (const item of multiValues) {
    sql = sql.replace(item[0], item[1]);
  }

  // replace remaining named values
  sql = sql.replace(NAMED_PARAM, '?');

  return [sql, parameters];
}
