var async = require('async'),
	rule_data = require('../data/rule_Manage.js'),
	mongoose = require('mongoose'),
	helper=require('../handlers/helper.js'),
	rule_class_data=require('../data/calss_rule_get.js');
exports.getClassRuleJSON=function(req,res){
	async.waterfall([
	                 function(cb){
	                	 
	                	 rule_class_data.getClassRuleJSON(cb);
	                 }
	                 
	                 ],
						
				function(err,ans){
		
					res.send(ans);
					
				});	
};
exports.deleteNode=function(req,res){
	async.waterfall([
	                 function(cb){
	                	 rule_class_data.deleteNode(req.body,cb);
	                 }	                 	                
	                 ],function(err,result){
							if(err){
								res.send('failure');
							}else{
								res.send('ok');
							}
						
		
						});
	
};