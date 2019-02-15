const fs = require('fs');

//Require all other modules
const tables = require('./tables.js');

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
}

module.exports = tjdb;