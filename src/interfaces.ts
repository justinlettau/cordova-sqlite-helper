/**
 * Named parameter object.
 */
export interface SqliteNamedParams {
  [name: string]: any;
}

/**
 * Results from `prepare` function.
 */
export type SqlitePrepareResult = [string, any[]];
