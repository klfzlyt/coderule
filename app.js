
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

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
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
