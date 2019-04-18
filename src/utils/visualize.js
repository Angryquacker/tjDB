const prettyjson = require('prettyjson');

/*
 * Class: visual - Convert the db file into a human readable format and output it
 */
class visual {
    /*
     * Method: visualize - outputs the db in visual form
     * @Param db - Db object passed by main.js <JSON>
     * @Param options - Object containing prettyjson options (Default is provided) <JSON> 
     * Returns - rendered db text
     */
    static visualize(db, options = { keysColor: 'cyan', stringColor: 'yellow', numberColor: 'magenta' }) {
        //Return the rendered db text
        return prettyjson.render(db, options);
    }
}

module.exports = visual;