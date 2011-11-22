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
        console.log(results);
        if(err)callback(err);
        else callback(null,results);
    });
};

exports.ArticleProvider=ArticleProvider;
