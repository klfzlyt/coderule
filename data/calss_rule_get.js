/**
 * db layer
 */
var class_data = require('./class_Manage.js'),
	regulation_data = require('./rule_Manage.js'),
	rule_data = require('./rule_data.js'),
	helper = require('../handlers/helper.js'),
	db = require('./db.js'),
	async = require('async'),
	mongoose = require('mongoose');
exports.deleteNode=function(data,callback){
		async.waterfall(
			[
			 function(cb){
				 if(data.isClass){
					 
					 class_data.deleteClass(data,cb);
				 }
				 else{
					 
					 regulation_data.deleteRule(data,cb);
				 }				
			 }],
			 function(err,result){
				if(err){
					callback(err);
				}
				else{
					callback(null,result);
				}
			});
};





exports.getClassRuleJSON=function(callll){
	//找到regulation的所有
	db.rule_M.find().toArray(function(err, result_arr) {
		async.mapSeries(result_arr, function(item1, callback) {
			async.parallel({								
				data: function(cb1) {
					async.mapSeries(item1.rule,
						function(item, cb) {
							var id = mongoose.Types.ObjectId(item.toString());
							db.rule_data_M.findOne({
								_id: id
							}, function(err, result) {
								cb(null, result);
							});
						},
						function(err, results) {
							console.log("dataxx: ",JSON.stringify(results));
							//item1.rule=results;
							cb1(null, results);
						}
					);
				},
				parents: function(cb1) {
					async.mapSeries(item1.parents_id,
						function(item, cb) {
							var id = mongoose.Types.ObjectId(item.toString());
							//如果规则上面还有规则的话，这里还要再规则表里面找
							//TODO
							db.class_M.findOne({
								_id: id
							}, function(err, result) {
							result.text=result.name;
								cb(null, result);
							});
						},
						function(err, results) {
							//console.log(results);
							//item1.rule=results;
							cb1(null, results);
						}
					);
				}
			}, function(err, result) {
				if (err) {
					return;
				}
				//异步汇总结果
			//	console.log('异步汇总结果: ',result);
				//这里能拿到所有parents了
				item1.text=item1.name;
				result.currentnode=item1;
				callback(null, result);
			});


		}, function(err, reuslt) {
			//最终结果
			//console.log('最终结果: ',reuslt);
			async.waterfall([
			             	function(cb1){
								//step1:在class集合中找到所有children_length=0的doc
								//step2：将第一步找到的doc的parents链存起来
								db.class_M.find({children_length:0}).toArray(function(err,re_arr){
									async.mapSeries(re_arr,
											//如果re_arr为空，说明没找到满足条件的docs
											//这个时候最终的callback的结果也是为空的
											function(item,callb){
										//既然是map就要严格遵守map的东西
												var parents_id=item.parents_id;
												//需要得到prents_id对应的object
												//由于parents_id是有顺序的，所以要使用mapseries
												async.mapSeries(parents_id,
														function(p_id,cb){
															//根据得到的p_id在class集合中找到对应的ob
															var id = mongoose.Types.ObjectId(p_id.toString());
															db.class_M.findOne({_id:id},function(err,classObject){
																classObject.text=classObject.name;
																cb(null,classObject);
															});																																		
														},
														function(err,parent_objects){
															item.text=item.name;
															parent_objects.push(item);
															callb(null,parent_objects);
														});																									
											},
											function(err,results){
												if(results.length==0){
													//说明没有找到满足条件的结果
													cb1(null,[]);
												}
												else{
													//results是一个二维数组													
													cb1(null,results);//这里的结果传的相当重要
												}																									
											});									
								});													
							},
							function(class_matrix,cb1){
								cb1(null,class_matrix,reuslt);
							}			                 			                 			                 			                 
			                 ],function(err,class_matrix,root_arry){
									getJSON.prototype.getJstr(root_arry,class_matrix,function(err,root_arry){										
										//console.log(root_arry);
										for (var i = 0; i < root_arry.length; i++) {
											getJSON.prototype.updateClass(root_arry[i]);
										}
									//	console.log(JSON.stringify(root_arry));
										var str=JSON.stringify(root_arry);
										str=str.replace(/_id/g,"id");
										console.log(str);
										callll(null,str);
									});
							});

		});
	});
};

//规则建立
//还有类建立
function getJSON()
{
	
	
};
getJSON.prototype.updateClass=function(node){
	if(node.rule==undefined){node.isClass=true;}
	else{node.isClass=false;}
	for(var i=0;i<node.children.length;i++){
		arguments.callee(node.children[i]);
	}
};
getJSON.prototype.getJstr=function(arr,class_matrix,callbbback){
	//构建node数组
	//console.log(arr);
	 async.waterfall([
	function(cb1){
	async.map(arr,
		function(item,cb){		
			item.currentnode.rule=item.data;	
			//console.log('item.currentnode: ',JSON.stringify(item.currentnode));
			item.parents.push(item.currentnode);		
			//console.log(item.parents);
			cb(null,item.parents);
		},
		function(err,results1){
		console.log('xxxxxxxxxxxxx:    ',JSON.stringify(results1));
			cb1(null,results1);
		});
	},
	function(original_data,cb1){
		//将original_data与class_matrix两个二维数组合并为一个
		for(var i=0;i<class_matrix.length;i++){
			original_data.push(class_matrix[i]);
		}		
		cb1(null,original_data);					
	},
	function(data,cb1){
	//	console.log("data: ",JSON.stringify(data));
		var isexsit_onenode=function(node,root){
		//console.log("node._id: ",node._id);
		//console.log("root._id: ",root._id);
		//console.log(typeof node._id);
		var node_str=JSON.stringify(node._id);
		var root_str=JSON.stringify(root._id);
			if(node_str==root_str)
			{	
				console.log('equal');
				return true;
			}
			for(var i=0;i<root.children.length;i++){
				var ans=isexsit_onenode(node,root.children[i]);
				if(ans)return true;
			}
			return false;			
		};
		var isexsit=function(node,root_arry){
			if(root_arry.length==0)return false;
			for(var i=0;i<root_arry.length;i++){
			//begin
				var root=root_arry[i];
				var ans=isexsit_onenode(node,root);
				if(ans)return true;
			//end	
			}
			return false;
		};	
		
		//node,to be finded in the root
		var findnode=function(node,root){
			var node_str=JSON.stringify(node._id);
			var root_str=JSON.stringify(root._id);
			if(node_str==root_str)
			{	
				//console.log('equal');
				return root;
			}
			for(var i=0;i<root.children.length;i++){
				var ans=findnode(node,root.children[i]);
				if(ans)return ans;
			}
			return false;			
		};	
		var findnode_arry=function(node,root_arry){
			if(root_arry.length==0)return false;
			for(var i=0;i<root_arry.length;i++){
			//begin
				var root=root_arry[i];
				var ans=findnode(node,root);
				if(ans)return ans;
			//end	
			}
			return false;
		};
		
		//root_arry可能是一个数组  find({depth:1})
		var root_arry=[];
		for(var i=0;i<data.length;i++){
			for(var j=0;j<data[i].length;j++){
				if(data[i][j]==undefined)continue;
				if(data[i][j].children==undefined){
					data[i][j].children=[];
				}
				if(!isexsit(data[i][j],root_arry)){
					if(j!=0){
						console.log('xxxx');
						findnode_arry(data[i][j-1],root_arry).children.push(data[i][j]);
					}
					else{
						//j=0第一个
						console.log('push le');
						root_arry.push(data[i][j]);
					}
				}
				else{
					//存在node					
				}
			}			
		}
		cb1(null,root_arry);		
	}],callbbback);
};

//exports.getClassRule=function(query,cb){
//	async.waterfall([
//	                 	function(cb){
//	                 		console.log('f');
//	                 		db.rule_M.find({},cb);
//	                 		
//	                 	}	                                
//	                 ],				                 	               
//			function(err,result){
//				console.log(result);
//					
//	});
//	
//	
//}