/**
 * New node file
 */
var fs  = require("fs");
global.config = {
	    properties: JSON.parse(fs.readFileSync("./service-defaults.json","utf8"))
	};