const fs = require('fs');
var path = require('path');
const request = require('request');

class cluster {
    /*
    * Method: createCluster - create a DB cluster for multiple HDD / SSD / Servers
    * @Param clusterName - name of the cluster to create <String>
    * @Param maxTablesPerServer - Maximum number of tables to have in one single DB <Integer>
    * Returns - None
    */ 
    constructor(clusterName, maxTablesPerServer) {
        //Make sure maxTablesPerServer is > 0
        if(maxTablesPerServer <= 0) {
            throw new Error("Invalid value for maxTablesPerServer, value must be greater than 0");
            return;
        }

        //Make sure maxTablesPerServer is not a different type
        if(typeof maxTablesPerServer != "number") {
            throw new Error("Invalid value for paramater maxTablesPerServer. Expected an integer, instead got: " + typeof maxTablesPerServer);
            return;
        }

        //Give the clusterName a file extension for later use
        clusterName = clusterName + ".tjdb";

        //For use in other methods
        this.name = clusterName;

        //Load the data if it already exists
        if(fs.existsSync(clusterName)) {
            this.settings = fs.readFileSync(clusterName, "utf-8");
            return;
        }

        //Create a cluster settings file
        fs.closeSync(fs.openSync(clusterName, "w"));

        //Create the cluster settings object
        this.settings = {
            maxTables: maxTablesPerServer,
            localClients: [], //An Array of object with the list of tables in that db plust the path ex. { path: "C://Users/Desktop/test.tjdb", tables: ["test1", "test2"] }
            seperateServerClients: [] //An Array of objects with data like so, { path: "C://Users/Desktop/test.tjdb", port: 8080, IP: 192.168.1.1 }
        }

        //Write the contents of the settings to the file
        fs.writeFileSync(clusterName, JSON.stringify(this.settings));
    }

    /*
    * Method: linkDB - Take a tjDB file and link it to the cluster
    * @Param db - DB file passed by the user to add to the db cluster <String>
    * @Param options - Only use if the other db is non-local (On a different machine) Ex. { path: "C://Users/Desktop/test.tjdb", port: 8080, IP: 192.168.1.1 } <JSON>
    * Returns - None   
    */ 
    linkDB(db, options) {
        //Make sure the db exists
        if(!fs.exists(db)) {
            throw new Error("The DB supplied does not exist...");
            return;
        }

        //Just use the local file if the db is on the master machine
        if(!options) {
            let data = JSON.parse(fs.readFileSync(db));
            let tableNames = [];
            let dbPath = path.resolve(db);

            //Add each table to the tableNames array
            Object.keys(data).forEach((key) => {
                tableNames.push(key);
            });

            let newDB = {
                path: dbPath,
                tables: tableNames
            }

            //Add all of the data to the this.settings, then write it to the settings file
            this.settings.localClients.push(newDB);
            fs.writeFileSync(this.name, this.settings);
        }
    }
}

const test = new cluster("test", 200);