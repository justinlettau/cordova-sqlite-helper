[![NPM Version](https://badge.fury.io/js/cordova-sqlite-utility.svg)](https://badge.fury.io/js/cordova-sqlite-utility)
[![Build Status](https://travis-ci.org/justinlettau/cordova-sqlite-utility.svg?branch=master)](https://travis-ci.org/justinlettau/cordova-sqlite-utility)
[![Dependency Status](https://david-dm.org/justinlettau/cordova-sqlite-utility.svg)](https://david-dm.org/justinlettau/cordova-sqlite-utility)
[![Dev Dependency Status](https://david-dm.org/justinlettau/cordova-sqlite-utility/dev-status.svg)](https://david-dm.org/justinlettau/cordova-sqlite-utility?type=dev)

# Cordova SQLite Utility
Utilities to make working with [cordova-sqlite-storage](https://github.com/litehelpers/Cordova-sqlite-storage) easier.

# Installation
```
npm install -g cordova-sqlite-utility
```

# Usage
Just import what you need to get started.

```js
import { prepare } from 'cordova-sqlite-utility';
```

## Prepare
The `prepare` function handles named parameters and safely converts JavaScript data types to SQLite counterparts.

```js
import { prepare } from 'cordova-sqlite-utility';

const prepared = prepare('select * from Example where Name = @name and isActive = @isActive', {
  name: 'Tony',
  isActive: true
});

db.executeSql(...prepared, results => {
  console.log(results);
});
```
