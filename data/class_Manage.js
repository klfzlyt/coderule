var db=require('./db.js'),
	async=require('async'),
	helper=require('../handlers/helper.js'),
	mongoose = require('mongoose');
	

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

exports.updateClass=function(data,callback){
	var id = mongoose.Types.ObjectId(data.id);
	async.waterfall([
	                 	function(cb){
	                 	cb(null,data);	
	                 	},
	                 	function(updata_data,cb){
	                 	db.class_M.update({_id:id},{$set:{name:updata_data.text,update_date:helper.getTime(),children_length:updata_data.children_length}},cb);
	                 	}	                 	               	               
	                 ],function(err,result){
							if(err){
								console.log('upate_class_name_err');
							}
							else{
								callback(null,result);
							}
								
		
			}
		);
	
};

exports.deleteClass=function(data,callback){
	var id = mongoose.Types.ObjectId(data.id);
	async.waterfall([
	                 	function(cb){
	                 		
	                 		//     		
	                 		if(!data.isClass)cb({err:'not class'});
	                 		db.class_M.remove({_id:id},function(err,result){
	                 			cb(null,result);
	                 			
	                 		});	                 			                 	
	                 	}
	                 
	                 
	                 ],function(err,result){
								if(err)callback(err);
								callback(null,result);
		
							
							});
		
	
	
};