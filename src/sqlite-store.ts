/**
 * Store SQL statements for reuse.
 */
export class SQLiteStore {

  /**
   * Stored statements.
   */
  private static statements: { [key: string]: string; } = {};

  /**
   * Get a stored SQL statement by name.
   *
   * @param name Statement name.
   */
  public static get(name: string): string | undefined {
    if (!name) {
      return;
    }

    return SQLiteStore.statements[name] || undefined;
  }

  /**
   * Add SQL statements to the store.
   *
   * @param statements Statements to add.
   */
  public static set(statements: { [key: string]: string; }): void {
    if (!statements) {
      return;
    }

    Object.assign(SQLiteStore.statements, statements);
  }
}
