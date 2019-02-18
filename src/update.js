/*
 * Class: Update - Responsible for changing values inside of tables, or tables themselves 
 */
class update {
    /*
     * Method: deleteColumn - deletes a column in a table
     * @Param db - db object passed by main.js <JSON>
     * @Param tableName - Name of the table to delete the column from <String>
     * @colName - Name of the column to delete <String>
     * Returns - DB Object
     */
    static deleteColumn(db, tableName, colName) {
        //Make sure the table exists
        if (!db[tableName]) {
            throw new Error("Invalid or non-existent table");
            return db;
        }

        //Make sure the column existed in the first place
        if (!db[tableName][colName]) {
            throw new Error("Invalid or non-existent column");
            return db;
        }

        //Delete the specified column
        delete db[tableName][colName];

        //Return the db object
        return db;
    }

    /*
     * Method: insertColumn - Creates a new column
     * @Param db - db object passed by main.js <JSON>
     * @Param tableName - Table where the column is to be added <String>
     * @Param colName - Name of the column to be created <String>
     * Returns - DB Object
     */ 
    static insertColumn(db, tableName, colName) {
        //Make sure the table exists 
        if (!db[tableName]) {
            throw new Error("Invalid or non-existent table");
            return db;
        }

        //Make sure the column doesn't already exist
        if (db[tableName][colName]) {
            throw new Error("Column Already Exists");
            return db;
        }

        //Create the new column
        db[tableName][colName] = [];

        //Return the DB object
        return db;
    }
}

module.exports = update;