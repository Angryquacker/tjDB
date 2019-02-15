const assert = require('assert');
const fs = require('fs');

//Import the tjdb moudle
const tjdb = require('../src/main.js');

//Create the db
var db = new tjdb("test.tjdb");

describe("tjdb", () => {
    describe("main.js", () => {
        it("Should create a new DB file", () => {
            //Check to see if a new file was created
            let exists = fs.existsSync("./test.tjdb");

            assert.equal(exists, true);
        });
    });

    describe("tables.js", () => {
        it("Should create a new table", () => {
            //Create a new table with two columns
            db.createTable("example", ["col1", "col2"]);
            db.commit();

            //Read the file and create an expected output
            let data = fs.readFileSync("test.tjdb", "utf-8");
            let expected = `{"example":{"col1":[],"col2":[]}}`;

            assert.equal(data, expected);
        });

        it("Should delete a table", () => {
            //Delete the table
            db.deleteTable("example");
            db.commit();

            //Read the file and create an expected output
            let data = fs.readFileSync("test.tjdb", "utf-8");
            let expected = `{}`;

            assert.equal(data, expected);
        });
    });
});