/*
 * Class: insert - handles insertion of data
 */ 
class insert {
    /*
     * Method: insertSingle - insert a single value into each column
     * @Param db - db object passed by main.js <JSON>
     * @Param tableName - Name of table to insert data into <String>
     * @Param values - values to insert into the DB <Array>
     * Returns - db object 
     */ 
    static insertSingle(db, tableName, values) {
        //Make sure the table exists
        if (!db[tableName]) {
            throw new Error("Invalid or non-existent table");
            return db;
        }

        //Get the number of columns
        let numOfColumns = Object.keys(db[tableName]).length;

        //Throw a new error is the number of values doesn't match the number of columns
        if (values.length < numOfColumns || values.length > numOfColumns) {
            throw new Error("Invalid number of values");
            return db;
        }

        //Set iterator
        let i = 0;

        //Loop over each key in the table
        for (var key in db[tableName]) {
            if (db[tableName].hasOwnProperty(key)) {
                //Insert the values
                db[tableName][key].push(values[i]);
                i++;
            }
        }

        //Return the db object
        return db;
    }

    /*
     * Method: insertMultiple - inserts multiple rows into the DB
     * @Param db - db object passed by main.js <JSON>
     * @Param tableName - Name of table to insert the rows into <String>
     * @Param values - An array of arrays where each array inside of the main array contains values for an insert <Array Arrays> Ex. [[1, 2], [3, 4]]
     * Returns - db object
     */
    static insertMultiple(db, tableName, values) {
        //Make sure the table exists
        if (!db[tableName]) {
            throw new Error("Invalid or non-existent table");
            return db;
        }

        //Get the number of columns
        let numOfColumns = Object.keys(db[tableName]).length;

        //Iterate over each array in values to see if there are a correct number of values
        for (let i = 0; i < values.length; i++) {
            //If the array isn't an array of arrays, throw a new error. Do same if invalid number of values
            if (typeof values[i] != "object" || values[i].length < numOfColumns || values[i].length > numOfColumns) {
                throw new Error("Invalid values paramater");
                return db;
            }
        }

        //Iterate over each array in values
        for (let j = 0; j < values.length; j++) {
            //Set iterator for keys
            let i = 0;

            //Iterate over each key in the table
            for (var key in db[tableName]) {
                //Make sure each key is a property of the table
                if (db[tableName].hasOwnProperty(key)) {
                    //Push the value to the specific column
                    db[tableName][key].push(values[j][i]);
                    i++;
                } 
            }
        }

        //Return the db object
        return db;
    }
}

module.exports = insert;