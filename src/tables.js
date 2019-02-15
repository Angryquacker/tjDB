/*
 * Class tables - Handles table creation and deletion
 */ 
class tables {
    /*
     * Method: createTable - creates a table based on params passed by main.js
     * @Param db - DB Object <JSON>
     * @Param tableName - Name of table to be created <String>
     * @Param columns - Array of columns to create within specified table <String Array>
     * Returns db <JSON>
     */
    static createTable(db, tableName, columns) {
        //Create the table
        db[tableName] = {};

        //Create a new array inside of the table for each column
        columns.forEach((col) => {
            db[tableName][col] = [];
        });

        //Return the DB
        return db;
    }
}

module.exports = tables;