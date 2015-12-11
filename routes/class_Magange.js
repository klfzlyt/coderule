var helper = require('../handlers/helper.js'),
	async = require('async'),
	class_data = require('../data/class_Manage.js');


exports.version = "0.0.1";

exports.createClass = function(req, res) {
	async.waterfall([
			function(cb) {
				//校验
				// console.log(req.body);
				cb(null);
			},
			function(cb) {
				var ob = req.body;
				class_data.createClass(ob, cb);
			}
		],
		function(err, result) {
			if (err) {
				return;
			}
			console.log(result[0]);
			//分配一个id到客户端
			console.log("result[0]._id: 类别： ",typeof result[0]._id);
			console.log("result[0]._id: tostring后： ",result[0]._id.toString());
			res.send(result[0]._id);
		});
};

exports.updateClass=function(req,res){
		async.waterfall([
		                 function(cb){
		                	 cb(null,req.body);
		                	 
		                 },
		                 function(data,cb){
		                	 //TODO
		                	 console.log("post guolai d shuju_class: "+data.toString());
		                	 class_data.updateClass(data,cb);
		                 }
		                 
		                 
		                 ],function(err,result){
			   						if(err){
			   							err.code=0;
			   							err.name="err";
			   						helper.send_failure(res,err);
			   						}
			   						else
			   						{
									helper.send_success(res,result);
			   						}
									});
}