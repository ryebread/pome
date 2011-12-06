var mysql = require('mysql');
var DATABASE= 'pome';
var TABLE='article';
var client=mysql.createClient({
    port:8889,
    user:'root',
    password:'root',
    database:DATABASE
});

ArticleProvider=function(){};

ArticleProvider.prototype.findAll=function(callback){
    client.query('SELECT * from '+ TABLE,function(err,results,fields){
        if(err)callback(err);
        else callback(null,results);
    });
};

ArticleProvider.prototype.findById=function(id,callback){
    client.query('SELECT * from ' + TABLE +' where _id=?',[id],
                 function(err,results,fields){
                     if(err)callback(err);
                     else client.query('SELECT * from comment where aid=?',
                                       [id],
                                       function(err,comments,fields){
                                           if(err)callback(err);
                                           else 
                                               callback(null,results[0],comments);
                                       });
                 });
};

ArticleProvider.prototype.save=function(article, callback){
    article.created_at= new Date();
    client.query('INSERT INTO '+ TABLE +
                 ' SET title = ?,body = ?,created_at=? ',
                 [article.title,article.body,article.created_at],
                 function(err,results,fields){
                     if(err)callback(err);
                     else callback(null,article);
                 });
};

ArticleProvider.prototype.addCommentToArticle=function(id,comment,callback){
    client.query('INSERT INTO comment '+ 
                 ' SET aid=? ,name=?,comment=?,created_at=?',
                [id,comment.person,comment.comments,comment.created_at],
                function(error,results,fields){
                    if(error)callback(error);
                    else callback(null,comment);
                });
};

exports.ArticleProvider=ArticleProvider;
