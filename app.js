
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , db=require('./data/db.js')
  , class_route=require('./routes/class_Magange.js')
  , rule_route=require('./routes/rule_Magager.js')
  , ruleClass_route=require('./routes/Rule_Class.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

console.log('xxx');
if(process.env.VCAP_SERVICES)
{
    console.log(process.env.VCAP_SERVICES);
    
    
     
     
    
    
}



app.get('/', routes.index);
app.get('/users', user.list);
app.get('/tab',function(req,res){
	
	res.sendfile(__dirname+'/public/css/'+'layout.css');
//	var ss=1;
});
app.put('/addclass',class_route.createClass);
app.put('/addrule',rule_route.createRule);
app.post('/updateclass',class_route.updateClass);
app.post('/updaterule',rule_route.updateRule);
app.post('/deleteNode',ruleClass_route.deleteNode);
app.get('/getall.json',ruleClass_route.getClassRuleJSON);
db.init(function(err,result){
    if (err) {
    	console.log('errr');
        console.error("** FATAL ERROR ON STARTUP: ");
        console.error(err);
        process.exit(-1);
    }
	http.createServer(app).listen(app.get('port'), function(){
		  console.log('Express server listening on port ' + app.get('port'));
		});
});

