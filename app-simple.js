var express=require('express');
var ArticleProvider=require('./articleprovider-mysql.js').ArticleProvider;

var app=module.exports=express.createServer();

app.configure(function(){
  app.set('views',__dirname+'/views');
  app.set('view engine','jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret:"jklj;kjl;jkfdas"}));
  app.use(app.router);
  app.use(express.static(__dirname+'/public'));
});

app.configure('development',function(){
  app.use(express.errorHandler({dumpExceptions:true,showStack:true}));
});

app.configure('production',function(){
  app.use(express.errorHandler());
});

var articleProvider= new ArticleProvider();

function logged_in(req,res,next){
    if(req.session.is_logged_in === true){
        next();
}else{
    res.redirect('/login');
};
};
app.get('/',logged_in,function(req,res){
  articleProvider.findAll(function(error,docs){
    res.render('index.jade',{locals:{
      title: 'Articles',
      articles:docs
    }
                            });
  });
});

app.get("/login",function(req,res){
    res.render("login",{locals:{
        title:"Login"
    }});
});
app.post("/login",function(req,res){
    if(req.param('user')=="admin" && req.param('password')=="admin")
        req.session.is_logged_in = true;
    res.redirect('/');
});
app.get("/about",function(req,res){
    res.render("about",{locals:{
        title:"关于"
    }});
});

app.get("/article/new",function(req,res){
  res.render("article_new",{locals:{
    title:"New Article"
  }});
});
app.post("/article/new",logged_in,function(req,res){
  articleProvider.save({
    title: req.param('title'),
    body: req.param('body')
  },function(error,docs){
    res.redirect('/');
  });
});

app.post('/article/addComment',logged_in,function(req,res){
    articleProvider.addCommentToArticle(req.param('_id'),{
        person: req.param('person'),
        comments: req.param('comment'),
        created_at: new Date()
        },function(error,docs){
            res.redirect('/article/'+req.param('_id'));
        });
});

app.get('/article/:id',logged_in,function(req,res){
    articleProvider.findById(req.params.id,function(error,article,comment){
        console.log("log findByID:");
        console.log(article);
        console.log(comment);
        res.render('article_show.jade',
                   {locals:{
                       title: article.title,
                       article:article,
                       comments:comment
                   }
                   });
    });
});

app.listen(3000);
