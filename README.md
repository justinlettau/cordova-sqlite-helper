[![NPM Version](https://badge.fury.io/js/cordova-sqlite-utility.svg)](https://badge.fury.io/js/cordova-sqlite-utility)
[![CI](https://github.com/justinlettau/cordova-sqlite-utility/workflows/CI/badge.svg)](https://github.com/justinlettau/cordova-sqlite-utility/actions)
[![Dependency Status](https://david-dm.org/justinlettau/cordova-sqlite-utility.svg)](https://david-dm.org/justinlettau/cordova-sqlite-utility)
[![Dev Dependency Status](https://david-dm.org/justinlettau/cordova-sqlite-utility/dev-status.svg)](https://david-dm.org/justinlettau/cordova-sqlite-utility?type=dev)
[![codecov](https://codecov.io/gh/justinlettau/cordova-sqlite-utility/branch/master/graph/badge.svg)](https://codecov.io/gh/justinlettau/cordova-sqlite-utility)

# Cordova SQLite Utility

Utilities to make working with [cordova-sqlite-storage](https://github.com/litehelpers/Cordova-sqlite-storage) a little
easier. Features include:

- **Promise** based API.
- **Named parameters** for SQLite statements.
- Safely handle JavaScript **type conversion** to SQLite counterparts.
- Store **SQL statements** for reuse.

# Installation

```
npm install --save cordova-sqlite-utility
```

# API

## SQLite

### Open

Open or create a SQLite database file.

| Argument | Description             | Type                   |
| -------- | ----------------------- | ---------------------- |
| `config` | Database configuration. | `SQLiteDatabaseConfig` |

When opened, the database is set as the `current` database and subsequent calls on that `SQLite` instance are executed
against that database automatically.

```js
import { SQLite } from 'cordova-sqlite-utility';

const sqlite = new SQLite();

sqlite
  .open({ name: 'Awesome.db' })
  .then((db) => console.log('Database opened!'));
```

### Close

Close the `current` database.

```js
sqlite.close().then(() => console.log('Database closed!'));
```

### Remove

Delete the `current` database.

```js
sqlite.remove().then(() => console.log('Database deleted!'));
```

### Execute

Execute a SQL statement on the `current` database.

| Argument    | Description           | Type              |
| ----------- | --------------------- | ----------------- |
| `statement` | Statement to execute. | `SQLiteStatement` |

`INSERT`, `UPDATE`, and `DELETE` statements return a `SQLiteResult` object. `SELECT` statements return an array of
objects. Use the generic overload to specify the return object type (`T[]`) for `SELECT` statements.

```js
sqlite.execute <
  IAwesome >
  {
    sql: 'SELECT * FROM AwesomeTable WHERE id = @id',
    params: {
      id: 83,
    },
  }.then((data) => console.log(data));
// => IAwesome[]
```

```js
sqlite
  .execute({
    sql: 'INSERT INTO AwesomeTable (name) VALUES (@name)',
    params: {
      name: 'Yoda',
    },
  })
  .then((result) => console.log(result));
// => { insertId: 1, rowsAffected: 1 }
```

Since the `statement` is prepared with `SQLite.prepare` before execution, the `sql` property can be either a stored
statement (set via `SQLiteStore.set`) or inline SQL.

```js
sqlite.execute <
  IAwesome >
  {
    sql: 'Awesome_ReadById',
    params: {
      id: 83,
    },
  }.then((data) => console.log(data));
// => IAwesome[]
```

### Batch

Execute a batch of SQL statements on the `current` database.

| Argument     | Description            | Type                |
| ------------ | ---------------------- | ------------------- |
| `statements` | Statements to execute. | `SQLiteStatement[]` |

```js
sqlite
  .batch([
    {
      sql: 'CREATE TABLE IF NOT EXISTS AwesomeTable (id, name)',
    },
    {
      sql: 'INSERT INTO AwesomeTable VALUES (@name)',
      params: { name: 'Luke Skywalker' },
    },
    {
      sql: 'INSERT INTO AwesomeTable VALUES (@name)',
      params: { name: 'Darth Vader' },
    },
  ])
  .then(() => console.log('Batch complete!'));
```

Like `execute`, the `batch` method prepares statements with `SQLite.prepare`. So, the `sql` property can be either a
stored statement (set via `SQLiteStore.set`) or inline SQL.

## SQLiteStore

Store SQL statements for reuse.

### Set

Add SQL statements to the store.

```js
import { SQLiteStore } from 'cordova-sqlite-utility';

SQLiteStore.set({
  Awesome_Create: 'INSERT INTO AwesomeTable VALUES (@name)',
  Awesome_ReadById: 'SELECT * FROM AwesomeTable WHERE id = @id',
});
```

Storing SQL statements in files is often more manageable. If you'd like to keep your SQL statements in files, like
this ...

```
./sqlite
  Awesome_ReadById.sql
  Awesome_Create.sql
  ...
```

... then [sqlite-cordova-devtools](https://github.com/justinlettau/cordova-sqlite-devtools) can ready all you SQL files
for easy addition to the store.

```js
import { SQLiteStore } from 'cordova-sqlite-utility';

SQLiteStore.set(window['_sqlite']);
```

### Get

Get a stored SQL statement by name.

```js
import { SQLiteStore } from 'cordova-sqlite-utility';

const sql = SQLiteStore.get('Awesome_ReadById');
// => 'SELECT * FROM AwesomeTable WHERE id = @id'
```

## SQLiteUtility

Utility methods can be used outside of the API, for direct use with `sqlitePlugin`.

### Prepare

Safely transform named parameters and unsupported data types.

| Argument    | Description           | Type              |
| ----------- | --------------------- | ----------------- |
| `statement` | Statement to prepare. | `SQLiteStatement` |

```js
import { SQLiteUtility } from 'cordova-sqlite-utility';

const prepared = SQLiteUtility.prepare({
  sql: 'SELECT * FROM AwesomeTable WHERE id = @id and isActive = @isActive',
  params: {
    id: 83,
    isActive: true,
  },
});

console.log(prepared);
// => ['SELECT * FROM AwesomeTable WHERE id = ? and isActive = ?', [83, 1]]

db.executeSql(...prepared, (results) => {
  console.log(results);
});
```

The statement's `sql` property is used to first check the `SQLite` store for a stored statement. If no stored statement
is found the value itself is used.

```js
const prepared = SQLiteUtility.prepare({
  sql: 'Awesome_ReadById',
  params: {
    id: 83,
  },
});

console.log(prepared);
// => ['SELECT * FROM AwesomeTable WHERE id = ?', [83]]
```
