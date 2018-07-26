import { SQLiteDatabaseConfig, SQLiteResult, SQLiteResultSet, SQLiteResultSetRowList, SQLiteStatement } from './interfaces';
import { SQLiteUtility } from './sqlite-utility';

/**
 * SQLite database instance.
 */
export class SQLiteDatabase {
  constructor(db: any, config: SQLiteDatabaseConfig) {
    this.db = db;
    this.config = {
      location: 'default',
      ...config
    };
  }

  /**
   * Database instance.
   */
  public db: any;

  /**
   * Configuration used to open the database instance.
   */
  public config: SQLiteDatabaseConfig;

  /**
   * Match if the string starts with "SELECT".
   */
  private readonly startsWithSelect: RegExp = /^SELECT/i;

  /**
   * Open the database.
   */
  public open(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.open(resolve, reject);
    });
  }

  /**
   * Close the database.
   */
  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close(resolve, reject);
    });
  }

  /**
   * Execute a SQL statement.
   *
   * @param statement Statement to execute.
   */
  public execute<T>(statement: SQLiteStatement): Promise<SQLiteResult | T[]> {
    const [sql, params] = SQLiteUtility.prepare(statement);

    const promise = new Promise<SQLiteResultSet>((resolve, reject) => {
      this.db.executeSql(sql, params, resolve, reject);
    });

    return promise.then(result => {

      /**
       * An INSERT, UPDATE, or DELETE that does not affect any rows will return the same results as a SELECT that
       * returns no rows. Need to analysis the query in this situation to know what to return.
       */
      if (result.insertId || result.rowsAffected || !this.startsWithSelect.test(sql)) {
        return {
          insertId: result.insertId,
          rowsAffected: result.rowsAffected
        };
      } else {
        return this.rowListToArray(result.rows);
      }
    });
  }

  /**
   * Execute a batch of SQL statements.
   *
   * @param statements Statements to execute.
   */
  public batch(statements: SQLiteStatement[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const prepared: any[][] = [];
      statements.forEach(statement => prepared.push(SQLiteUtility.prepare(statement)));
      this.db.sqlBatch(prepared, resolve, reject);
    });
  }

  /**
   * Convert a `SQLiteResultSetRowList` object to an array of objects.
   *
   * @param rows Result set row list to convert.
   */
  private rowListToArray(rows: SQLiteResultSetRowList): any[] {
    const output: any[] = [];

    for (let i = 0; i < rows.length; i++) {
      output.push(rows.item(i));
    }

    return output;
  }
}
