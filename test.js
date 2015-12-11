//auto和queue还不熟
async=require('async');


var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
var configs = {};
var list=[];
var log=console.log;
var arr = [{name:'Jack', delay: 200},
           {name:'Mike', delay: 100},
           {name:'Freewind', delay: 300}];
async.series(
		[function(cb1){
async.mapSeries(list,function(item,cb){
	//item+=" q";
	console.log(item);
	cb(null,'ww');	
},function(err,res){
	console.log(res);
	cb1(null,res);
});
},

function(cb1){
async.each(arr, function(item, callback) {
    log('1.1 enter: ' + item.name);
    setTimeout(function(){
        log('1.1 handle: ' + item.name);
        callback(null, item.name);
    }, item.delay);
}, function(err) {
    log('1.1 err: ' + err);
    cb1(null);
});}],function(err,results){console.log(results)});
