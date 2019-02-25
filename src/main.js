const fs = require('fs');

//Require all other modules
const tables = require('./tables.js');
const insert = require('./insert.js');
const visual = require('./visualize.js');
const update = require('./update.js');
const get = require('./get.js');

/*
 * Class Variables
 * @var db - JSON Object <JSON>
 * @var fileName = Name of db file w/ extension <String>
 */ 
class tjdb {
    /*
     * Method: Constructor 
     * @Param name - File name w/ extension <String>
     * Returns - None
     */
    constructor(name) {
        //Get the extension
        let extension = name.split('.').pop();

        if (extension !== 'tjdb') {
            throw new Error("Invalid File Extension, Must be .tjdb");
            return;
        }

        //Check if the file exists, if so read the data then parse it and set it to the class var db
        //Else if it doesn't exists create the file and write a basic JSON object to it, set class var db = {}
        if (fs.exists(name)) {
            this.db = JSON.parse(fs.readFileSync(name, 'utf-8'));
        }
        else {
            this.db = {};
            //Create the DB file and write the object {} to it
            fs.closeSync(fs.openSync(name, "w"));
            fs.writeFileSync(name, JSON.stringify(this.db));
        }

        this.fileName = name;
    }

    /*
     * Method: commit - Write Object to the DB File
     * @Param NONE
     * Returns - NONE
     */
    commit() {
        //Write the contents of the DB to the file
        fs.writeFileSync(this.fileName, JSON.stringify(this.db));
    }

    /*
     * Method: createTable - Creates a new table
     * @Param db - DB Object <JSON>
     * @Param tableName - Name of table to be created <String>
     * @Param columns - Array of columns to create within specified table <String Array>
     * Returns - NONE
     */
    createTable(tableName, columns) {
        //Call createTable method in tables.js and set the result equal to the class var db
        this.db = tables.createTable(this.db, tableName, columns);
    }

    /*
     *  Method: deleteTable - deletes an existing table
     *  @Param tableName - Name of table to be deleted <String>
     *  Returns - None
     */
    deleteTable(tableName) {
        //Call deleteTable Method in tables.js and set the result equal to the class var db
        this.db = tables.deleteTable(this.db, tableName);
    }

    /*
     * Method: insertSingle - Inserts a single value into each column inside of a the specified table
     * @Param tableName - Name of table to insert data into <String>
     * @Param values - Array of values to insert into the DB <Array>
     * Returns - None
     */ 
    insertSingle(tableName, values) {
        //Call insertSingle method from insert.js, and set the result equal to the class var db
        this.db = insert.insertSingle(this.db, tableName, values);
    }

    /*
     * Method: insertMultiple - Insert mulitple values into a specified table
     * @Param tableName - Name of table to insert data into <String>
     * @Param values - An array of arrays where each array inside of the main array contains values for an insert <Array Arrays> Ex. [[1, 2], [3, 4]]
     * Returns - None
     */ 
    insertMultiple(tableName, values) {
        //Call insertMultiple method from insert.js and set the result equal to the class var db
        this.db = insert.insertMultiple(this.db, tableName, values);
    }

    /*
     * Method: visualize - Formats DB in text form
     * @Param options - Object containing prettyjson options (Default is provided) <JSON>
     * Returns - Formated DB text
     */
    visualize(options) {
        //Call visualize method from visualize.js
        return visual.visualize(this.db, options);
    }

    /*
     * Method: deleteColumn - Deletes the specified column
     * @Param tableName - Name of the table to delete the column from <String>
     * @colName - Name of the column to delete <String>
     * Returns - None
     */ 
    deleteColumn(tableName, colName) {
        //Call deleteColumn method from update.js
        update.deleteColumn(this.db, tableName, colName);
    }

    /*
     * Method: insertColumn - Creates a new column
     * @Param tableName - Table where the column is to be added <String>
     * @Param colName - Name of the column to be created <String>
     * Returns - None
     */ 
    insertColumn(tableName, colName) {
        //Call insertColumn method from update.js
        update.insertColumn(this.db, tableName, colName);
    }

    /*
     * Method: updateValue - Changes a single value in the DB
     * @Param tableName - Name of table to look in <String>
     * @Param colName - Name of column to look in <String>
     * @Param value - Value to change <ANY>
     * @Param newValue - Value to replace the orginal one with <ANY>
     * Similar to SQL UPDATE tableName SET colName = newValue WHERE colName = value
     * Returns - None
     */
    updateValue(tableName, colName, value, newValue) {
        //Call updateValue method from update.js
        this.db = update.updateValue(this.db, tableName, colName, value, newValue);
    }

    /*
     * Method: normalize - Fills in any gaps in the DB with a sepecific value, or null if left blank
     * @Param tableName - name of table to normalize (Will do the entire db IF NOT SPECIFIED) <String>
     * @Param newValue - Value passed by the user to fill in the gaps with (Defaults to null) <ANY>
     * Returns - None
     */
    normalize(newValue, tableName) {
        //Call normalize method from update.js
        this.db = update.normalize(this.db, tableName, newValue);
    }

    /*
     * Method: deleteValue - Delete a single value in the db
     * @Param tableName - Name of table to look in <String>
     * @Param colName - Name of column to look in <String>
     * @Param value - Value to delete <ANY>
     * @Param completeDeletion - Decide wether to delete the whole value or replace it with null (true = complete delete, false = replace with null) [Default = false] <Boolean>
     * Returns - None
     */
    deleteValue(tableName, colName, value, completeDeletion) {
        //Call deleteValue from update.js and set it equal to the DB object
        this.db = update.deleteValue(this.db, tableName, colName, value, completeDeletion);
    }

    /*
     * Method: deleteRow - Delete a row in a table
     * @Param tableName - Name of table to look in <String>
     * @Param options - Object dictating where to look <JSON> Ex. { name: "colName", value: 1  }
     * Returns - None
     */ 
    deleteRow(tableName, location) {
        //Call deleteRow method from update.js and set it equal to the DB Object
        this.db = update.deleteRow(this.db, tableName, location);
    }

    /*
     * Method: getAll - Returns the entire DB
     * @Param - None
     * Returns - DB Object in JSON Form
     */ 
    getAll() {
        //Call getAll method from get.js
        return get.getAll(this.db);
    }

    /*
     * Method: getTable - Returns all data in a table
     * @Param tableName - Name of table to look in <String>
     * Returns - table data
     */
    getTable(tableName) {
        //Call getTable method from get.js
        return get.getTable(this.db, tableName);
    }

    /*
     * Method:  getColumn - Returns all data in a column
     * @Param tableName - Name of table to look in <String>
     * @Param colName - Name of column to look in <String>
     * Returns - column data
     */
    getColumn(tableName, colName) {
        //Call getColumn method from get.js
        return get.getColumn(this.db, tableName, colName);
    }

    /*
     * Method: getSingle - Returns a single data point
     * @Param tableName - name of table to look in <String>
     * @Param returnColName - Name of column to retrive data from <String>
     * @Param options - Object dictating where to look <JSON> Ex. { name: "colName", value: 1  }
     * *Similar to SQL's SELECT colName FROM tableName WHERE options.name = options.value
     * Returns - Single Data Entry
     */
    getSingle(tableName, returnColName, options) {
        //Call getSingle method from get.js
        return get.getSingle(this.db, tableName, returnColName, options);
    }

    /*
     * Method: getRow - Returns a row of data
     * @Param tableName - Name of table to look in <String>
     * @Param location - <JSON>
     * Returns - Array of data results
     */
    getRow(tableName, location) {
        //Call getRow method from get.js
        return get.getRow(this.db, tableName, location);
    }
}

module.exports = tjdb;