# TjDB - Lightweight and easy to use database program

### Version 2.0.1 - Now features autosaving

## Creating & Saving the DB
- To create a DB you first have to require the tjdb package like so:
	- `const tjdb = require("tjdb");`

- Next, create the db variable by initizlizing the tjdb object - The one paramater is the DB name (**Must end in .tjdb**)
	- `var db = new tjdb("test.tjdb");`

- Finally, the database automatically saves, so there is no need to save manually

## Tables
- To **create** a table use method `createTable(tableName, columns)` - tableName: Name of table to create, columns: Array of columns to create
	- Ex. `db.createTable("test", ["col1", "col2"]);`

- To **delete** a table use method `deleteTable(tableName)` - tableName: Name of the table to delete
	- Ex. `db.deleteTable("test");`

## Inserting Data
- To insert a **single** row, use method `insertSingle(tableName, values)` - tableName: Name of table to insert the row into, values: An array with the same number of items as the number of columns
	- Ex. `db.insertSingle("test", [1, 2]);`
	- Please note, it is **much** more efficent to use `insertMultiple()` when inserting large amounts of data

- To Insert **multiple** rows, use mehtod `insertMultiple(tableName, values)` - tableName: Name of table to insert the rows into, values: An array of arrays each containing values
	- Ex. `db.insertMultiple("test", [[3, 4], [5, 6]]);`
	- The current DB should look like this: `{"test": "col1": [1, 3, 5], "col2": [2, 4, 6]}`

## Getting Data
- To get the entire DB in JSON format, use method `getAll()` - No Paramaters
	- Ex. `db.getAll();`

- To get all the data in a single table, use method `getTable(tableName)` - tableName: Name of table to get the data from
	- Ex. `db.getTable("test");`

- To get all the data in a single column, use method `getColumn(tableName, columnName)` - tableName: Name of table to look in, columnName: name of column to get the data from
	- Ex. `db.getColumn("test", "col1");`

- To return a single item, use method `getSingle(tableName, returnColName, options)` - tableName: Name of table to look in, returnColName: Name of column to retrive the data from, options: JSON specifying which column to look in and find the data from {name: name of the column, value: value to look for}
	- Ex. `db.getSingle("test", "col2", { name: "col1", value: 1 });`
	- This should return the value: 2

- To get a row of data, use method `getRow(tableName, location)` - tableName: Name of table to look in, location: Object dicating where to find the row { name: name of column to look in, value: Value to look for }
	- Ex. `db.getRow("test", { name: "col1", value: 1 });`
	- This should return the array (row) [1, 2]

## Updating The DB
- To delete a single column, use method `deleteColumn(tableName, colName)` - tableName: Name of table to look in, colName: Name of table to delete
	- Ex. `db.deleteColumn("test", "col2");`

- To insert a new column, use method `insertColumn(tableName, colName)` - tableName: Name of table to look in, colName: Name of the new column to create
	- Ex. `db.insertColumn("test", "col2");`

- To update a single value, use method `updateValue(tableName, colName, value, newValue)` - tableName: Name of table to look in, colName: Name of column to look in, value: The value to replace in that column, newValue: the value to replace it with
	- Ex. `db.updateValue("test", "col1", 5, 7);`
	- This would change the value of 5 in the column to 7

- To delete a single value, use method `deleteSingle(tableName, colName, value, completeDeletion = false)` - tableName: Name of table to look in, colName: Name of column to look in, value: the value to delete, completeDeletion (Default false), if true, the value is completely spliced from the DB, but if it is false, it will just replace it with null
	- Ex. `db.deleteSingle("test", "col1", 3, true)`
	- col1 will now look like this [1, 7]

- To delete a single row, use method `deleteRow(tableName, options)` - tableName: Name of table to look in, options: location of the row { name: Name of column to look in, value: value to look for }
	- If the db looks like this `{"test": "col1": [1, 3, 5], "col2": [2, 4, 6]}`
	- Ex. `db.deleteRow("test", { name: "col1", value: 1 });`
	- The DB will now look like this `{"test": "col1": [3, 5], "col2": [4, 6]}`

## Extra Functions
- To visulalize the DB, use method `visualize(options = { keysColor: 'cyan', stringColor: 'yellow', numberColor: 'magenta' })` - options: Object which sets the properties to print, see https://www.npmjs.com/package/prettyjson for formating options
	- Ex. `console.log(db.visualize());`

- To Normaliz (fill) the DB, use method `normalize(newValue = null, tableName = null)` - newValue: the value to add in to replace empty spaces, **YOU MUST SPECIFIY THE TABLE, OTHERWISE IT WILL DO THE ENTIRE DB** tableName: Name of table to normalize, default is the entire DB
	- Ex. `db.normalize(null, "test");`
	- If the original DB looked like this `{"test": "col1": [3], "col2": [4, 6]}`, it would now look like this: {"test": "col1": [3, null], "col2": [4, 6]}