var class_data = require('./class_Manage.js'),
	regulation_data = require('./rule_Manage.js'),
	rule_data = require('./rule_data.js'),
	helper = require('../handlers/helper.js'),
	db = require('./db.js'),
	async = require('async'),
	mongoose = require('mongoose');

db.init(function(res){
	
	db.class_M.remove({nx:'123'},function(err,result){
		
			console.log(err);
			console.log(result);
		
	});
	
	
	
	
	
	
	
	
	
});