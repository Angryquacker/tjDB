const tjdb = require('../main.js');
const fs = require('fs');

class cluster {
    /*
    * Method: createCluster - create a DB cluster for multiple HDD / SSD / Servers
    * @Param clusterName - name of the cluster to create <String>
    * Returns - None
    */ 
    constructor(clusterName) {
        //Give the clusterName a file extension for later use
        clusterName = clusterName + ".tjcb";

        //For use in other methods
        this.name = clusterName;

        //Load the data if it already exists
        if (fs.existsSync(clusterName)) {
            //Get the settings file contents
            this.settingsObj = JSON.parse(fs.readFileSync(clusterName, "utf-8"));

            //Create a handler
            this.handler = {
                set: (obj, prop, value) => {
                    obj[prop] = value;

                    console.log("dood");

                    for (let i = 0; i < this.settings.localClients.length; i++) {
                        //Save all the options files
                        fs.writeFileSync(this.settings.localClients.path[i] + `/${this.name}`, JSON.stringify(this.settings));
                    }
                }
            }

            //Creater the proxy
            this.settings = new Proxy(this.settingsObj, this.handler); 

            return;
        }

        //Create a cluster settings file
        fs.closeSync(fs.openSync(clusterName, "w"));

        //Create the cluster settings object
        this.settingsObj = {
            localClients: [], //An Array of object with the list of tables in that db plust the path ex. { name: "test.tjdb", path: "C://Users/Desktop", tables: ["test1", "test2"] }
        };

        //Create a proxy handler
        this.handler = {
            set: (obj, prop, value) => {
                obj[prop] = value;

                for (let i = 0; i < this.settings.localClients.length; i++) {
                    //Save all the options files
                    fs.writeFileSync(this.settings.localClients[i].path + `/${this.name}`, JSON.stringify(this.settings));
                }

            }
        }

        //Create the proxy
        this.settings = new Proxy(this.settingsObj, this.handler); 

        //Write the contents of the settings to the file
        fs.writeFileSync(clusterName, JSON.stringify(this.settings));
    }

    /*
     * Method: createDB - Create a new DB to add to the cluster
     * @Param dbName - Name of the DB to create <String> (Should include .tjdb)
     * @Param dbPath - Path to the root directory of the new DB <String>
     * Returns - None
     */
    createDB(dbName, dbPath) {
        //Throw error if the DB already exists
        if (fs.existsSync(dbPath + `/${dbName}`)) {
            throw new Error("DB Already Exists");
        }

        //Create the db file
        let db = new tjdb(dbPath + `/${dbName}`);

        //Add the db to the settings file then write it to the new DB location along with the original location
        this.settings.localClients.push({ name: dbName, path: dbPath, tables: [] });

        fs.writeFileSync(this.name, JSON.stringify(this.settings));
        fs.writeFileSync(dbPath + `/${this.name}`, JSON.stringify(this.settings));
    }

    /*
     * Method: createTable - Create a new table inside of a DB
     * @Param dbName - Name of the DB to create the table in <String> ("Should include .tjdb")
     * @Param tableName - Name of the table to create <String>
     * @Param tableColumns - Array of columns to create within specified table <String Array>
     * Returns - None
     */
    createTable(dbName, tableName, tableColumns) {
        let index;
        let db;

        for (let i = 0; i < this.settings.localClients.length; i++) {
            if (this.settings.localClients[i].name == dbName) {
                db = new tjdb(this.settings.localClients[i].path + `/${this.settings.localClients[i].name}`);
                this.settings.localClients[i]["tables"].push(tableName);
                break;
            }
        }

        db.createTable(tableName, tableColumns);
    }
}

const test = new cluster("test", 200);
//test.createDB("testo.tjdb", `D:/JS Projects/TjDB/src/Cluster`);
test.createTable("testo.tjdb", "exam", ["col1", "col2"]);