[![NPM Version](https://badge.fury.io/js/cordova-sqlite-utility.svg)](https://badge.fury.io/js/cordova-sqlite-utility)
[![Build Status](https://travis-ci.org/justinlettau/cordova-sqlite-utility.svg?branch=master)](https://travis-ci.org/justinlettau/cordova-sqlite-utility)
[![Dependency Status](https://david-dm.org/justinlettau/cordova-sqlite-utility.svg)](https://david-dm.org/justinlettau/cordova-sqlite-utility)
[![Dev Dependency Status](https://david-dm.org/justinlettau/cordova-sqlite-utility/dev-status.svg)](https://david-dm.org/justinlettau/cordova-sqlite-utility?type=dev)
[![codecov](https://codecov.io/gh/justinlettau/cordova-sqlite-utility/branch/master/graph/badge.svg)](https://codecov.io/gh/justinlettau/cordova-sqlite-utility)

# Cordova SQLite Utility
Utilities to make working with [cordova-sqlite-storage](https://github.com/litehelpers/Cordova-sqlite-storage) a little
easier. Features include:

- **Promise** based API.
- **Named parameters** for SQLite statements.
- Safely handle JavaScript **type conversion** to SQLite counterparts.

# Installation
```
npm install --save cordova-sqlite-utility
```

# API

## SQLite

### Open
Open or create a SQLite database file.
When opened, the database is set as the `current` database and subsequent calls on that `SQLite` instance are executed
against that database automatically.

```js
import { SQLite } from 'cordova-sqlite-utility';

const sqlite = new SQLite();
sqlite.open({ name: 'Awesome.db' })
  .then(db => console.log('Database opened!'));
```

| Argument | Description             | Type                   |
|----------|-------------------------|------------------------|
| `config` | Database configuration. | `SQLiteDatabaseConfig` |

### Close
Close the `current` database.

```js
sqlite.close();
```

### Remove
Delete the `current` database.

```js
sqlite.remove();
```

### Execute
Execute a SQL statement on the `current` database.

`INSERT`, `UPDATE`, and `DELETE` statements return a `SQLiteResult` object. `SELECT` statements return an array of
objects. Use the generic overload to specify the return object type (`T[]`) for `SELECT` statements.

```js
sqlite.execute<IAwesome>({
  sql: 'SELECT * FROM AwesomeTable WHERE id = @id',
  params: {
    id: 83
  }
}).then(data => console.log(data));
// => IAwesome[]
```

```js
sqlite.execute({
  sql: 'INSERT INTO AwesomeTable (name) VALUES (@name)',
  params: {
    name: 'Yoda'
  }
}).then(result => console.log(result));
// => { insertId: 1, rowsAffected: 1 }
```

| Argument    | Description           | Type              |
|-------------|-----------------------|-------------------|
| `statement` | Statement to execute. | `SQLiteStatement` |

### Batch
Execute a batch of SQL statements on the `current` database.

```js
sqlite.batch([
  {
    sql: 'CREATE TABLE IF NOT EXISTS AwesomeTable (id, name)',
  },
  {
    sql: 'INSERT INTO AwesomeTable VALUES (@name)',
    params: { name: 'Luke Skywalker' }
  },
  {
    sql: 'INSERT INTO AwesomeTable VALUES (@name)',
    params: { name: 'Darth Vader' }
  }
]).then(() => console.log('Batch complete!'));
```

| Argument     | Description            | Type                |
|--------------|------------------------|---------------------|
| `statements` | Statements to execute. | `SQLiteStatement[]` |

## SQLiteUtility
Utility methods can be used outside of the API, for direct use with `sqlitePlugin`.

### Prepare
Safely transform named parameters and unsupported data types.

```js
import { SQLiteUtility } from 'cordova-sqlite-utility';

const prepared = SQLiteUtility.prepare({
  sql: 'SELECT * FROM AwesomeTable WHERE id = @id and isActive = @isActive',
  params: {
    id: 83,
    isActive: true
  }
});

console.log(prepared);
// => ['SELECT * FROM AwesomeTable WHERE id = ? and isActive = ?', [83, 1]]

db.executeSql(...prepared, results => {
  console.log(results);
});
```

| Argument    | Description           | Type              |
|-------------|-----------------------|-------------------|
| `statement` | Statement to prepare. | `SQLiteStatement` |
