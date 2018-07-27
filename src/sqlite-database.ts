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
   * Indicates if debug mode is enabled.
   */
  public debug: boolean = true;

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
    const id: string = 'Anonymous execute';
    this.logStart(id);

    const [sql, params] = SQLiteUtility.prepare(statement);

    const promise = new Promise<SQLiteResultSet>((resolve, reject) => {
      this.db.executeSql(sql, params, resolve, reject);
    });

    return promise
      .then(result => {

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
      })
      .then(result => {
        this.logEnd(id);
        return result;
      })
      .catch(error => {
        this.logEnd(id);
        throw error;
      });
  }

  /**
   * Execute a batch of SQL statements.
   *
   * @param statements Statements to execute.
   */
  public batch(statements: SQLiteStatement[]): Promise<void> {
    const id: string = 'Anonymous batch';
    this.logStart(id);

    const prepared: any[][] = [];
    statements.forEach(statement => prepared.push(SQLiteUtility.prepare(statement)));

    const promise = new Promise<void>((resolve, reject) => {
      this.db.sqlBatch(prepared, resolve, reject);
    });

    return promise
      .then(() => this.logEnd(id))
      .catch(error => {
        this.logEnd(id);
        throw error;
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

  /**
   * Timer log start.
   *
   * @param id Timer unique id.
   */
  private logStart(id: string): void {
    if (!this.debug) {
      return;
    }

    console.time(id);
  }

  /**
   * Timer log end.
   *
   * @param id Timer unique id.
   */
  private logEnd(id: string): void {
    if (!this.debug) {
      return;
    }

    console.timeEnd(id);
  }
}
