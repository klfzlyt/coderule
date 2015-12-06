var db=require('./db.js'),
	async=require('async');


exports.createClass=function(data,callback){
	async.waterfall([
	                 	function(cb){
	                 		
	                 		//判断指定的类别存不存在
	                 		//data数据要解析
	                 		cb(null,data);
	                 	},
	                 	function(classdat,cb){
	                 		 var classO = JSON.parse(JSON.stringify(classdat));
	                 	      var m = new Date();
	                 	      var dateString =
	                 	          m.getUTCFullYear() +"/"+
	                 	          ("0" + (m.getUTCMonth()+1)).slice(-2) +"/"+
	                 	          ("0" + m.getUTCDate()).slice(-2) + " " +
	                 	          ("0" + m.getUTCHours()).slice(-2) + ":" +
	                 	          ("0" + m.getUTCMinutes()).slice(-2) + ":" +
	                 	          ("0" + m.getUTCSeconds()).slice(-2);
	                 	      classO.date=dateString;
	                 		db.class_M.insert(classO,{w:1,safe:true},cb);
	                 		
	                 		//cb(null);
	                 	},
	                 	function(result,cb){

	                 		cb(null,result);
	                 	}
	                 ],function(err,result){
							if(err)callback({});
							else callback(null,result);		
								});
};