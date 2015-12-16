
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: '编码规则制定工具' });
};