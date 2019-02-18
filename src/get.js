/*
 * Class get - Responsible for getting items from the DB
 */
class get {
    /*
     * Method: getAll - Returns all data in the DB
     * @Param db - DB Object passed by main.js <JSON>
     * Returns - DB Object 
     */
    static getAll(db) {
        //Return the db
        return db;
    }

    /*
     * Method: getTable - Returns all data in a table
     * @Param db - DB Object passed by main.js <JSON>
     * @Param tableName - Name of table to look in <String>
     * Returns - DB Object
     */ 
    static getTable(db, tableName) {
        //Make sure the table exists
        if (!db[tableName]) {
            throw new Error("Invalid or non-existent table");
            return db;
        }

        //Return the table;
        return db[tableName];
    }

    /*
     * Method: getColumn - Returns all data in a column
     * @Param db - DB Objeft passed by main.js <JSON>
     * @Param tableName - name of table to look in <String>
     * @Param colName - Name of column to look in <String>
     */
    static getColumn(db, tableName, colName) {
        //Make sure the table and column exists
        if (!db[tableName] || !db[tableName][colName]) {
            throw new Error("Invalid or non-existent table/column");
            return db;
        }

        //Return the column
        return db[tableName][colName];
    }

    /*
     * Method: getSingle - Get a single item based on input paramaters
     * @Param db - DB Object passed by main.js <JSON>
     * @Param tableName - name of table to look in <String>
     * @Param returnColName - Name of column to retrive data from <String>
     * @Param options - Object dictating where to look <JSON> Ex. { name: "colName", value: 1  }
     * *Similar to SQL's SELECT colName FROM tableName WHERE options.name = options.value
     * Returns - Single Data entry
     */ 
    static getSingle(db, tableName, returnColName, options) {
        //Make sure table and two columns exist
        if (!db[tableName] || !db[tableName][returnColName]) {
            throw new Error("Invalid or non-existent table/column");
            return db;
        }

        //Make sure the column in options exists
        if (!db[tableName][options.name]) {
            throw new Error("The column specified in options does not exist");
            return db;
        }

        //Make sure all columns specified have the same number of items
        if (db[tableName][options.name].length !== db[tableName][returnColName].length) {
            if (db[tableName][options.name].length < db[tableName][returnColName].length) {
                //Set length of the return column
                let returnLen = db[tableName][returnColName].length;
                let neededLen = returnLen - db[tableName][options.name].length;

                for (let i = 0; i < neededLen; i++) {
                    db[tableName][options.name].unshift(null);
                }
            }
            else {
                //Set length of the option col
                let returnLen = db[tableName][options.name].length;
                let neededLen = returnLen - db[tableName][returnColName].length;

                for (let i = 0; i < neededLen; i++) {
                    db[tableName][options.name].unshift(null);
                }
            }
        }

        //Get the index of the item in the options column then use that index to fine the other item in the return column
        let index = db[tableName][options.name].indexOf(options.value);

        //Get the item to return
        let returnable = db[tableName][returnColName][index];

        //If the item is undefined throw an error
        if (!returnable) {
            throw new Error("Invalid value declared in options");
            return;
        }

        //Return the data
        return returnable;
    }

    /*
     * Method: getRow - Returns a row of data in the DB
     * @Param db - DB Object passed by main.js <JSON>
     * @Param tableName - Name of table to look in <String>
     * @Param location - Object dicating where the column is <JSON>
     * Returns - array containing the row data
     */
    static getRow(db, tableName, location) {
        let returnArray = [];
    }
}

module.exports = get;