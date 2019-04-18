const checkType = require('../utils/typeCheck.js');

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
        }

        //Make sure the column existed in the first place
        if (!db[tableName][colName]) {
            throw new Error("Invalid or non-existent column");
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
        }

        //Make sure the column doesn't already exist
        if (db[tableName][colName]) {
            throw new Error("Column Already Exists");
        }

        //Create the new column
        db[tableName][colName] = [];

        //Return the DB object
        return db;
    }

    /*
     * Method: updateValue - Change a single value 
     * @Param db - DB Object passed by main.js <JSON>
     * @Param tableName - Name of table to look in <String>
     * @Param colName - Name of column to look in <String>
     * @Param value - Value to change <ANY>
     * @Param newValue - Value to replace the orginal one with <ANY>
     * Similar to SQL UPDATE tableName SET colName = newValue WHERE colName = value
     * Returns - DB Object
     */
    static updateValue(db, tableName, colName, value, newValue) {
        //Make sure the column and table exists
        if (!db[tableName] || !db[tableName][colName]) {
            throw new Error("Invalid or non-existent table/column");
        }

        //Make sure the type given is correct
        let type = colName.split(":");
        if (type.length == 2) {
            type = type[1];

            if (!checkType(type, newValue)) {
                throw new TypeError(`Expected type: <${type}> but got: <${typeof newValue}> instead.`);
            }
        }


        //Get the index of the old value
        let oldIndex = db[tableName][colName].indexOf(value);

        //Set the old value to the new value
        db[tableName][colName][oldIndex] = newValue;

        return db;
    }

    /*
     * Method: updateValueSpecififc - Change a single value based a specific parmaters
     * @Param db - DB Object passsed by main.js <JSON>
     * @Param tableName - Name of table to look in <String>
     * @Param colName - Name of column to look in <String>
     * @Param newValue - Value to replace the original one with <ANY>
     * @Param location - Object dictating where to look Ex. { name: "exam", value: 2 } <JSON> 
     * Similar to SQL's UPDATE tableName set colName = newValue WHERE location.name = location.value
     * Returns - DB Object
     */
    static updateValueSpecific(db, tableName, colName, newValue, location) {
        //Make sure the column and table exists
        if (!db[tableName] || !db[tableName][colName]) {
            throw new Error("Invalid or non-existent table/column");
        }

        //Make sure the type given is correct
        let type = colName.split(":");
        if (type.length == 2) {
            type = type[1];

            if (!checkType(type, newValue)) {
                throw new TypeError(`Expected type: <${type}> but got: <${typeof newValue}> instead.`);
            }
        }

        //Get the index
        let oldIndex = db[tableName][location.name].indexOf(location.value);

        //Set the value
        db[tableName][colName][oldIndex] = newValue;

        return db;
    }

    /*
     * Method: deleteValue - Delete a single value in the db
     * @Param db - DB Object passed by main.js <JSON>
     * @Param tableName - Name of table to look in <String>
     * @Param colName - Name of column to look in <String>
     * @Param value - Value to delete <ANY>
     * @Param completeDeletion - Decide wether to delete the whole value or replace it with null (true = complete delete, false = replace with null) [Default = false] <Boolean>
     * Returns - DB Object
     */
    static deleteValue(db, tableName, colName, value, completeDeletion = false) {
        //Make sure the column and table exists
        if (!db[tableName] || !db[tableName][colName]) {
            throw new Error("Invalid or non-existent table/column");
        }

        var index = db[tableName][colName].indexOf(value);

        if (index == -1) {
            throw new Error("Invalid value");
        }

        if (completeDeletion) {
            //Remove the element completely if true
            db[tableName][colName].splice(index, 1);

            return db;
        }

        db[tableName][colName][index] = null;

        //Return the DB
        return db;
    }

    /*
     * Method: deleteRow - Delete a row in a table
     * @Param db - DB Object passed by main.js <JSON>
     * @Param tableName - Name of table to look in <String>
     * @Param options - Object dictating where to look <JSON> Ex. { name: "colName", value: 1  }
     * Returns - DB Object
     */
    static deleteRow(db, tableName, options) {
        //Make sure the table and column exists
        if (!tableName || !options.name) {
            throw new Error("Invalid or non-existent table/column");
        }

        //Make sure all columns are of the same length
        db = this.normalize(db, null, tableName);

        //Get the index of the specified value
        let index = db[tableName][options.name].indexOf(options.value);

        if (index === -1) {
            throw new Error("Invalid value declared in the options paramater");
        }

        Object.keys(db[tableName]).forEach((col) => {
            //Delete the value from each column
            db[tableName][col].splice(index, 1);
        });

        //Return the db
        return db;
    }

    /*
     * Method: normalize - Fills in any gaps in the DB with a sepecific value, or null if left blank
     * @Param db - DB object passed by main.js <JSON>
     * @Param tableName - name of table to normalize (Will do the entire db IF NOT SPECIFIED) <String>
     * @Param newValue - Value passed by the user to fill in the gaps with (Defaults to null) <ANY>
     * Returns - DB Object
     */
    static normalize(db, newValue = null, tableName = null) {
        //Check to see if the user specified a table, if not, get the greatest value in the entire db insted of just one table
        if (tableName == null) {
            var largest = 0;

            //Get the greatest value in the db
            Object.keys(db).forEach((table) => {
                Object.keys(db[table]).forEach((col) => {
                    if (db[table][col].length > largest) {
                        largest = db[table][col].length;
                    }
                });
            });
        }
        else {
            var largest = 0;

            //Get the greatest value in the table
            Object.keys(db[tableName]).forEach((col) => {
                if (db[tableName][col].length > largest) {
                    largest = db[tableName][col].length;
                }
            });
        }

        //Insert the newValue if the current column is smaller than the largest
        if (tableName == null) {
            Object.keys(db).forEach((table) => {
                Object.keys(db[table]).forEach((col) => {
                    if (db[table][col].length < largest) {
                        //Add in the newValue
                        for (let i = 0; i < largest; i++) {
                            db[table][col].unshift(newValue);
                        }
                    }
                });
            });
        }
        else {
            Object.keys(db[tableName]).forEach((col) => {
                if (db[tableName][col].length < largest) {
                    //Add in the newValue
                    for (let i = 0; i < newValue; i++) {
                        db[tableName][col].unshift(newValue);
                    }
                }
            });
        }

        //Return the db
        return db; 
    }
}

module.exports = update;