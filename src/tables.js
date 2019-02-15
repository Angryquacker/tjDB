/*
 * Class tables - Handles table creation and deletion
 */ 
class tables {
    /*
     * Method: createTable - creates a table based on params passed by main.js
     * @Param db - DB Object <JSON>
     * @Param tableName - Name of table to be created <String>
     * @Param columns - Array of columns to create within specified table <String Array>
     * Returns - db <JSON>
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

    /*
     * Method: deleteTable - deletes a table based on param passed by main.js
     * @Param db - DB Object <JSON>
     * @Param tableName - Name of table to be deleted <String>
     * Returns - db <JSON>
     */ 
    static deleteTable(db, tableName) {
        //Check if the table exists -> Throw error if it doesn't
        if (!db[tableName]) {
            throw new Error("Table does not Exist");
            return db;
        }

        //Delete the table and return the db
        delete db[tableName];
        return db;
    }
}

module.exports = tables;