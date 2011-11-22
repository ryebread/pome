/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.login = function(req, res){
  res.render('login', { title: 'Login' })
};

exports.about = function(req, res){
  res.render('about',{title: 'about'})
};
