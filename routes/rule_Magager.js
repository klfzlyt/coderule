/**
 * New node file
 */
var async = require('async'),
	rule_data = require('../data/rule_Manage.js'),
	mongoose = require('mongoose'),
	helper=require('../handlers/helper.js');

exports.createRule = function(req, res) {

	async.waterfall([
			function(cb) {


				cb(null, req.body);
			},
			function(data, cb) {

				rule_data.createRule(data, cb);
			}
		],
		function(err, result) {
			if (err) {

			}
			else{
				//分配一个id到客户端
				res.send(result[0]._id);
			}
		});


};
exports.updateRule=function(req,res){
	async.waterfall([
	                 function(cb){
	                	 cb(null,req.body)
	                 },
	                 function(data,cb){
	                	var result={};
	                	result.id=data.id;
	                	 if(data.isClass){cb({code:0,name:"err"});}
	                	 result.rule=data.rule;
	                	 result.text=data.text;
	                	 
	                	rule_data.updateRule(result,cb);
	                 }
	                 ],
	                 function(err,result){
						if(err){
							console.log("err");
						}
						else{
							helper.send_success(res,result);	
						}
						
	});	
};

