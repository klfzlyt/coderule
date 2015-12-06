var helper=require('../handlers/helper.js'),
	async=require('async'),
	class_data=require('../data/class_Manage.js');


exports.version="0.0.1";

exports.createClass=function(req,res){
	async.waterfall([
	                 function(cb){
	                	 //校验
	                	// console.log(req.body);
	                	 cb(null);
	                 },
	                 function(cb){
	                	 var ob=req.body
	                	 class_data.createClass(ob,cb);
	                 }	                 	                 	                 	                 
	                 ],
	                 function(err,result){		
		if(err){return;}
						console.log(result[0]);
						res.send(result[0]._id);						
						});
};