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

        let validTypes = ["number", "string", "boolean", "null", "symbol", "function", "object", "array"];

        //Make sure the columns don't include any illegal characters
        top:
            columns.every((col) => {
                let type = col.split(":");

                //Make sure only one colon is present
                if (type.length > 2) {
                    throw new Error("More than one colon is present in the given column");
                }

                //If no data type is present, do nothing
                if (type.length == 1) {
                    return;
                }

                type = type[1];

                //Make sure a valid type is given
                for (let i = 0; i < validTypes.length; i++) {
                    if (type == validTypes[i]) {
                        return;
                    }
                }

                //Throw an error if an invalid type is used
                throw new TypeError("Invalid Data Type in the columns");
            });

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
        }

        //Delete the table and return the db
        delete db[tableName];
        return db;
    }
}

module.exports = tables;