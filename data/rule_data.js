/**
 * New node file
 */
var db = require('./db.js'),
	async = require('async'),
	mongoose = require('mongoose'),
	helper = require('../handlers/helper.js');
exports.addRuledata = function(data, callback) {
	async.waterfall([
		function(cb) {
			cb(null,data);
		},
		function(data, cb) {
			//data是单个规则的data 
			if(data.data.length==undefined||data.name==undefined){
				//TODO还有backup等undefinded要加
				cb({err:"data_length_undefined"});
			}
			data.date=helper.getTime();
			db.rule_data_M.insert(data,{w:1,safe:true},cb);
		}
	], function(err, result) {
		if (err){
			callback({err:"data_insert_err"});
		}
		else{
			callback(null,result);
		}
	});
}