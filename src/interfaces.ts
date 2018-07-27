/**
 * Database configuration options.
 */
export interface SQLiteDatabaseConfig {
  name: string;
  location?: string;
}

/**
 * SQLite statement.
 */
export interface SQLiteStatement {
  sql: string;
  params?: { [index: string]: any };
}

/**
 * Named parameter object.
 */
export interface SQLiteParams {
  [name: string]: any;
}

/**
 * Result from execute.
 */
export interface SQLiteResult {
  insertId: number;
  rowsAffected: number;
}

/**
 * Result from prepare.
 */
export type SQLitePrepared = [string, any[]];

/**
 * Result set from execute.
 */
export interface SQLiteResultSet {
  insertId: number | undefined;
  rowsAffected: number;
  rows: SQLiteResultSetRowList;
}

/**
 * Result set row list.
 */
export interface SQLiteResultSetRowList {
  item: (index: number) => object;
  length: number;
}
