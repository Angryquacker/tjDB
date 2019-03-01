const assert = require('assert');
const fs = require('fs');

//Import the tjdb moudle
const tjdb = require('../src/main.js');

//Create the db
var db = new tjdb("test.tjdb");

describe("TjDB", () => {
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
            

            //Read the file and create an expected output
            let data = fs.readFileSync("test.tjdb", "utf-8");
            let expected = `{"example":{"col1":[],"col2":[]}}`;

            assert.equal(data, expected);
        });

        it("Should delete a table", () => {
            //Delete the table
            db.deleteTable("example");
            

            //Read the file and create an expected output
            let data = JSON.stringify(db.getAll());
            let expected = `{}`;

            assert.equal(data, expected);
        });
    });

    describe("insert.js", () => {
        it("Should insert a single row", () => {
            //Create a new table and insert a single row
            db.createTable("example", ["col1", "col2"]);
            db.insertSingle("example", [1, 2]);
            

            //Read the file and create an expected output
            let data = JSON.stringify(db.getAll());
            let expected = `{"example":{"col1":[1],"col2":[2]}}`;

            assert.equal(data, expected);
        });

        it("Should insert three rows", () => {
            //Insert three rows
            db.insertMultiple("example", [[3, 4], [5, 6], [7, 8]]);
            

            //Read the file and create an expected output
            let data = JSON.stringify(db.getAll());
            let expected = `{"example":{"col1":[1,3,5,7],"col2":[2,4,6,8]}}`;

            assert.equal(data, expected);
        });
    });

    describe("update.js", () => {
        it("Should delete a column", () => {
            //Create a new table then delete a column inside of it
            db.createTable("temp", ["col"]);
            db.deleteColumn("temp", "col");
            

            //Read the file and create an expected output
            let data = JSON.stringify(db.getAll());
            let expected = `{"example":{"col1":[1,3,5,7],"col2":[2,4,6,8]},"temp":{}}`;

            assert.equal(data, expected);
        });

        it("Should insert a new column", () => {
            //Insert a new column
            db.insertColumn("temp", "col");
            

            //Read the file and create an expected ouput
            let data = JSON.stringify(db.getAll());
            let expected = `{"example":{"col1":[1,3,5,7],"col2":[2,4,6,8]},"temp":{"col":[]}}`;

            assert.equal(data, expected);
        });

        it("Should change a single value", () => {
            //Change a single value 
            db.updateValue("example", "col1", 1, 10);
            
            let data = JSON.stringify(db.getAll());
            let expected = `{"example":{"col1":[10,3,5,7],"col2":[2,4,6,8]},"temp":{"col":[]}}`;

            assert.equal(data, expected);
        });

        it("Should delete a single value", () => {
            //Delete the value -> False is optional
            db.deleteValue("example", "col1", 7, false);
            let data = JSON.stringify(db.getAll());
            let expected = `{"example":{"col1":[10,3,5,null],"col2":[2,4,6,8]},"temp":{"col":[]}}`;

            assert.equal(data, expected);
        });

        it("Should delete a row", () => {
            //Create a new table with two columns, and insert two rows
            db.createTable("deleteTest", ["col", "du"]);
            db.insertMultiple("deleteTest", [[1, 2], [3, 4]]);
            db.deleteRow("deleteTest", { name: "col", value: 1 });
            

            let data = JSON.stringify(db.getAll());
            let expected = `{"example":{"col1":[10,3,5,null],"col2":[2,4,6,8]},"temp":{"col":[]},"deleteTest":{"col":[3],"du":[4]}}`;

            assert.equal(data, expected);
        });
    });

    describe("get.js", () => {
        it("Should return the entire DB", () => {
            //Delete the table added previously
            db.deleteTable("deleteTest");
            

            //Get the  DB
            let data = JSON.stringify(db.getAll());
            let expected = `{"example":{"col1":[10,3,5,null],"col2":[2,4,6,8]},"temp":{"col":[]}}`;

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
            let expected = `[10,3,5,null]`;

            assert.equal(data, expected);
        });

        it("Should return a single item", () => {
            //Get a single item
            let data = db.getSingle("example", "col2", { name: "col1", value: 10 });
            let expected = 2;

            assert.equal(data, expected);
        });

        it("Should return a row", () => {
            //Get a row
            let data = db.getRow("example", { name: "col1", value: 10 }).toString();
            let expected = "10,2";

            assert.equal(data, expected);
        });
    });

    describe("Extra Functions", () => {
        it("Should normalize the DB", () => {
            //Normalize the DB
            db.normalize();
            

            //Get the whole db
            let data = JSON.stringify(db.getAll());
            let expected = `{"example":{"col1":[10,3,5,null],"col2":[2,4,6,8]},"temp":{"col":[null,null,null,null]}}`;

            assert.equal(data, expected);
        });

        it("Should visualize the DB", () => {
            let expected = false;

            if (db.visualize() !== JSON.stringify(db.getAll())) {
                expected = true;
            }

            assert.equal(true, expected);
        });
    });
});

describe("TjDB Clusters", () => {
    describe("cluster.js", () => {
        it("This is just a place for future features...", () => {

        });
    });

    after(() => {
        //Delete the DB File
        fs.unlink("./test.tjdb", (err) => {
            if (err) throw err;
        });
    });
});