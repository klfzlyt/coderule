var path=require('path');


exports.send_success = function(res, data) {
   // res.writeHead(200, {"Content-Type": "application/json"});
    var output = { error: null, data: data };
    res.end(JSON.stringify(output) + "\n");
}


exports.send_failure = function(res, err) {
    var code = (err.code) ? err.code : err.name;
    //res.writeHead(code, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
}
exports.getTime=function(){
				var m = new Date();
				var dateString =
					m.getUTCFullYear() + "/" +
					("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" +
					("0" + m.getUTCDate()).slice(-2) + " " +
					("0" + m.getUTCHours()).slice(-2) + ":" +
					("0" + m.getUTCMinutes()).slice(-2) + ":" +
					("0" + m.getUTCSeconds()).slice(-2);
					return dateString;

}