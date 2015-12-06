var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    async = require('async'),
    local = require("../config.js");

var host = local.config.db_config.host
    ? local.config.db_config.host
    : 'localhost';
var port = local.config.db_config.port
    ? local.config.db_config.port
    : Connection.DEFAULT_PORT;
var ps = local.config.db_config.poolSize
    ? local.config.db_config.poolSize : 5;

var db = new Db('coderule', 
                new Server(host, port, 
                           { auto_reconnect: true,
                             poolSize: ps}),
                { w: 1 });
console.log(port);
/**
 * Currently for initialisation, we just want to open
 * the database.  We won't even attempt to start up
 * if this fails, as it's pretty pointless.
 */
exports.init = function (callback) {
    async.waterfall([
        // 1. open database connection
        function (cb) {
            console.log("\n** 1. open db");
            db.open(cb);
        },

        function (db_conn, cb) {
         
            db.collection("class", cb);
        },

        function (class_coll, cb) {
            exports.class_M = class_coll;
           // db.collection("photos", cb);
            callback(null);
        }
    ], callback);
};
exports.class_M = null;



