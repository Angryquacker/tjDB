# TjDB - Lightweight and easy to use database program

## Creating & Saving the DB
- To create a DB you first have to require the tjdb package like so:
	- `const tjdb = require("tjdb");`

- Next, create the db variable by initizlizing the tjdb object - The one paramater is the DB name (**Must end in .tjdb**)
	- `var db = new tjdb("test.tjdb");`

- Finally, to **SAVE** the db use method `db.commit();` **THIS IS NEEDED TO SAVE THE DB TO THE FILE (DO NOT FORGET!)**

## Tables
- To **create** a table use method `createTable(tableName, columns)` - tableName: Name of table to create, columns: Array of columns to create
	- Ex. `db.createTable("test", ["col1", "col2"]);`

- To **delete** a table use method `deleteTable(tableName)` - tableName: Name of the table to delete
	- Ex. `db.deleteTable("test");`

## Inserting Data
- To insert a **single** row, use method `insertSingle(tableName, values)` - tableName: Name of table to insert the row into, values: An array with the same number of items as the number of columns
	- Ex. `db.insertSingle("test", [1, 2]);`

- To Insert **multiple** rows, use mehtod `insertMultiple(tableName, values)` - tableName: Name of table to insert the rows into, values: An array of arrays each containing values
	- Ex. `db.insertMultiple("test", [[3, 4], [5, 6]]);`
	- The current DB should look like this: `{"test": "col1": [1, 3, 5], "col2": [2, 4, 6]}`

## Getting Data
	
