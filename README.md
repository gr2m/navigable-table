# Navigable Table – A jQuery plugin

> A jQuery plugin for elegant editing of data collections.

[![Build Status](https://travis-ci.org/gr2m/navigable-table.svg)](https://travis-ci.org/gr2m/navigable-table)
[![Dependency Status](https://david-dm.org/gr2m/navigable-table.svg)](https://david-dm.org/gr2m/navigable-table)
[![devDependency Status](https://david-dm.org/gr2m/navigable-table/dev-status.svg)](https://david-dm.org/gr2m/navigable-table#info=devDependencies)

## Download / Installation

You can download the latest JS & CSS code here:

- https://npmcdn.com/navigable-table/dist/navigable-table.js

Or install via [npm](https://www.npmjs.com/)

```
npm install --save navigable-table
```

The JS code can be required with

```js
var jQuery = require('jquery')
var navigableTable = require('navigable-table')

// init
navigableTable(jQuery)
```

## Usage

```html
<!-- load jquery -->
<script src="jquery.js"></script>

<!-- load navigable-table assets -->
<script src="navigable-table.js"></script>

<!-- The data-navigable-spy attribute initializes the table on first interaction -->
<table data-navigable-spy class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>E-Mail</th>
      <th>Birthday</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><input name="name" value="Raphael Saadiq" placeholder="Joe Doe"></td>
      <td><input name="email" value="raphael@example.com" placeholder="joe@example.com" type="email"></td>
      <td><input name="birthday" value="05/14/1966" placeholder="01/01/1980" type="date"></td>
    </tr>
    <tr>
      <td><input name="name" value="Dawn Robinson" placeholder="Joe Doe"></td>
      <td><input name="email" value="dawn@example.com" placeholder="joe@example.com" type="email"></td>
      <td><input name="birthday" placeholder="11/24/1965" type="date"></td>
    </tr>
    <tr>
      <td><input name="name" value="Ali Shaheed Muhammad" placeholder="Joe Doe"></td>
      <td><input name="email" value="ali@example.com" placeholder="joe@example.com" type="email"></td>
      <td><input name="birthday" placeholder="08/11/1970" type="date"></td>
    </tr>
  </tbody>
</table>
```

## Events

```
// bump event when there is no column / row to jump / move to
$table.on('bump', function(event, direction) {});
$table.on('bump:up', function(event) {});
$table.on('bump:down', function(event) {});

// move events, when a row is moved up or down
$table.on('move', function(event, direction, index) {});
$table.on('move:up', function(event, index) {});
$table.on('move:down', function(event, index) {});

// move events, before a row is moved up or down.
// The 'move' events can be preventend by calling cancelMove()
$table.on('before:move', function(event, direction, index, cancelMove) {});
$table.on('before:move:up', function(event, index, cancelMove) {});
$table.on('before:move:down', function(event, index, cancelMove) {});
```

## Local Setup

```bash
git clone git@github.com:gr2m/navigable-table.git
cd navigable-table
npm install
```

## Test

You can start a local dev server with

```bash
npm start
```

Run tests with

```bash
npm test
```

While working on the tests, you can start Selenium / Chrome driver
once, and then tests re-run on each save

```bash
npm run test:mocha:watch
```

## Fine Print

The Expandable Input Plugin have been authored by [Gregor Martynus](https://github.com/gr2m),
proud member of the [Hoodie Community](http://hood.ie/).

License: MIT
