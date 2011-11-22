
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret:"ejfkdl;sjafkuiourewhjkl"}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/login',function(req,res){
if (req.body.user=="liubin")
res.redirect('/')
else
res.redirect('/login')
});
app.get('/about', routes.about);
//File not found
app.get('/*', function(req, res){
        res.render('404',{status: 404,
        title:'404 - 文件未找到'});
}); 

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
