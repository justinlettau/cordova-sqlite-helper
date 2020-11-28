import {
  SQLiteDatabaseConfig,
  SQLiteResult,
  SQLiteStatement,
} from './interfaces';
import { SQLiteDatabase } from './sqlite-database';

declare const sqlitePlugin: any;

/**
 * SQLite utility.
 */
export class SQLite {
  /**
   * Currently active SQLite database.
   */
  private current: SQLiteDatabase;

  /**
   * Open or create a SQLite database file.
   *
   * @param config Database configuration.
   */
  public open(config: SQLiteDatabaseConfig): Promise<SQLiteDatabase> {
    return new Promise((resolve, reject) => {
      sqlitePlugin.openDatabase(
        config,
        (db) => {
          this.current = new SQLiteDatabase(config, db);
          resolve(this.current);
        },
        reject
      );
    });
  }

  /**
   * Close the `current` database.
   */
  public close(): Promise<void> {
    if (!this.current) {
      return Promise.reject('Current database not set.');
    }

    return this.current.close();
  }

  /**
   * Delete the `current` database.
   */
  public remove(): Promise<any> {
    if (!this.current) {
      return Promise.reject('Current database not set.');
    }

    return new Promise((resolve, reject) => {
      sqlitePlugin.deleteDatabase(this.current.config, resolve, reject);
    });
  }

  /**
   * Execute a SQL statement on the `current` database.
   *
   * @param statement Statement to execute.
   */
  public execute<T>(statement: SQLiteStatement): Promise<SQLiteResult | T[]> {
    if (!this.current) {
      return Promise.reject('Current database not set.');
    }

    return this.current.execute(statement);
  }

  /**
   * Execute a batch of SQL statements on the `current` database.
   *
   * @param statements Statements to execute.
   */
  public batch(statements: SQLiteStatement[]): Promise<void> {
    if (!this.current) {
      return Promise.reject('Current database not set.');
    }

    return this.current.batch(statements);
  }
}
