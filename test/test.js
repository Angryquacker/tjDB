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

    describe("insert.js", () => {
        it("Should insert a single row", () => {
            //Create a new table and insert a single row
            db.createTable("example", ["col1", "col2"]);
            db.insertSingle("example", [1, 2]);
            db.commit();

            //Read the file and create an expected output
            let data = fs.readFileSync("./test.tjdb", "utf-8");
            let expected = `{"example":{"col1":[1],"col2":[2]}}`;

            assert.equal(data, expected);
        });

        it("Should insert three rows", () => {
            //Insert three rows
            db.insertMultiple("example", [[3, 4], [5, 6], [7, 8]]);
            db.commit();

            //Read the file and create an expected output
            let data = fs.readFileSync("./test.tjdb", "utf-8");
            let expected = `{"example":{"col1":[1,3,5,7],"col2":[2,4,6,8]}}`;

            assert.equal(data, expected);
        });
    });

    describe("update.js", () => {
        it("Should delete a column", () => {
            //Create a new table then delete a column inside of it
            db.createTable("temp", ["col"]);
            db.deleteColumn("temp", "col");
            db.commit();

            //Read the file and create an expected output
            let data = fs.readFileSync("./test.tjdb", "utf-8");
            let expected = `{"example":{"col1":[1,3,5,7],"col2":[2,4,6,8]},"temp":{}}`;

            assert.equal(data, expected);
        });

        it("Should insert a new column", () => {
            //Insert a new column
            db.insertColumn("temp", "col");
            db.commit();

            //Read the file and create an expected ouput
            let data = fs.readFileSync("./test.tjdb", "utf-8");
            let expected = `{"example":{"col1":[1,3,5,7],"col2":[2,4,6,8]},"temp":{"col":[]}}`;

            assert.equal(data, expected);
        });
    });

    describe("get.js", () => {
        it("Should return the entire DB", () => {
            //Get the  DB
            let data = JSON.stringify(db.getAll());
            let expected = `{"example":{"col1":[1,3,5,7],"col2":[2,4,6,8]},"temp":{"col":[]}}`;

            assert.equal(data, expected);
        });

        it("Should return all data in a single table", () => {
            //Get the table data
            let data = JSON.stringify(db.getTable("temp"));
            let expected = `{"col":[]}`;

            assert.equal(data, expected);
        });

        it("Should return all data in a column", () => {
            //Get the column data
            let data = JSON.stringify(db.getColumn("example", "col1"));
            let expected = `[1,3,5,7]`;

            assert.equal(data, expected);
        });

        it("Should return a single item", () => {
            //Get a single item
            let data = db.getSingle("example", "col2", { name: "col1", value: 1 });
            let expected = 2;

            assert.equal(data, expected);
        });
    });

    after(() => {
        //Delete the DB File
        fs.unlink("./test.tjdb", (err) => {
            if (err) throw err;
        });
    })
});