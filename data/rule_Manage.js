/**
 * New node file
 */
var db = require('./db.js'),
	async = require('async'),
	mongoose = require('mongoose'),
	helper=require('../handlers/helper.js'),
	rule_data=require('./rule_data.js');

exports.createRule = function(data, callback) {
	async.waterfall(
		[
			function(cb) {
				cb(null, data);
			},
			function(data, cb) {
				var classO = JSON.parse(JSON.stringify(data));
				var m = new Date();
				var dateString =
					m.getUTCFullYear() + "/" +
					("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" +
					("0" + m.getUTCDate()).slice(-2) + " " +
					("0" + m.getUTCHours()).slice(-2) + ":" +
					("0" + m.getUTCMinutes()).slice(-2) + ":" +
					("0" + m.getUTCSeconds()).slice(-2);
				classO.date = dateString;
				db.rule_M.insert(classO, {
					w: 1,
					safe: true
				}, cb);
			}
		],
		function(err, result) {
			if (err) {} else {
				callback(null, result);
			}
		});
};


exports.updateRule = function(data, callback){
	var id = mongoose.Types.ObjectId(data.id);
	var result_arr=[];
	var foreachAdd=function (data_arr,i,result_arr,cb){
		if(i==data_arr.length){
			cb(null,result_arr);
			return;
			};
			data_arr[i].position=i;
		rule_data.addRuledata(data_arr[i],function(err,result){			
			result_arr.push(result[0]._id);
			i++;
			foreachAdd(data_arr,i,result_arr,cb);
		});		
	};
	
	async.waterfall(
		[
			function(cb){
									
				foreachAdd(data.rule,0,result_arr,cb);
				//1.在regulation表中找到data.id
				//2.清除rule數組的所有數據
				//3.重新根據data.rule的數據在data表中生成數據，再把id加到regulation表的rule數組中
				//4.更新regulation的name
			},
			function(results,cb){
				//result为添加的数据的数组
			//db.rule_M.update({_id:id},{:{name:data.text,update_date:helper.getTime(),rule:[]}},cb);
				//TODO
				console.log(results);
				db.rule_M.update({_id:id},{$set:{name:data.text,update_date:helper.getTime(),rule:results}},function(err,reuslt){
					
					console.log("update_result: "+reuslt);
					cb(null,reuslt);
				});
					
				},function(results,cb){
					console.log("important: ",results);
					cb(null,results);
					
				}				
		], 
		function(err, result) {
			if(err){
				
			}
			else{
				callback(null,result);	
			}
	});
};



exports.deleteRule=function(data,callback){
	var id = mongoose.Types.ObjectId(data.id);
	async.waterfall([
						function(cb){
							
							if(data.isClass){cb({err:'is class'})}
							db.rule_M.remove({_id:id},function(err,result){
								
								cb(null,result);
							});
							
							
						}
		
		
					],function(err,result){
							if(err)callback(err);
							else callback(null,result);
		
		
	});		
};
