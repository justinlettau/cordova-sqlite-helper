import { isArray, isBoolean, isDate, isUndefined } from 'ts-util-is';

import { SQLiteParams, SQLitePrepared, SQLiteStatement } from './interfaces';
import { SQLiteStore } from './sqlite-store';

/**
 * SQLite utility methods.
 */
export class SQLiteUtility {
  /**
   * Regex to find named parameters.
   * Example: `@exampleId`.
   */
  private static readonly param: RegExp = /@([\w]+)/gi;

  /**
   * Safely transform named parameters and unsupported data types.
   *
   * @param statement Statement to be prepared.
   */
  public static prepare(statement: SQLiteStatement): SQLitePrepared {
    let match: RegExpExecArray;
    let outputParams: any[] = [];
    let sql: string = SQLiteStore.get(statement.sql) || statement.sql;
    const params: SQLiteParams = statement.params || {};
    const csvParams: any[][] = [];

    // tslint:disable-next-line:no-conditional-assignment
    while ((match = SQLiteUtility.param.exec(sql)) !== null) {
      let value: any = params[match[1]];

      // array of values are used for `were in ()` statements, and need a separate param (`?`) in the query for each
      if (isArray(value)) {
        value = value.filter(
          (item, index, self) => self.indexOf(item) === index
        );
        outputParams = outputParams.concat(value);
        csvParams.push([match[0], value.map(() => '?').join(',')]);
        continue;
      }

      // undefined -> null (prevents error in Windows)
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

      outputParams.push(value);
    }

    // replace named param with `?`
    csvParams.forEach((item) => (sql = sql.replace(item[0], item[1])));
    sql = sql.replace(SQLiteUtility.param, '?');
    sql = sql.trim();

    return [sql, outputParams];
  }
}
