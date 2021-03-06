const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB")

const articlesSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("Article", articlesSchema);

const article1 = new Article({
    title:"Deepak",
    content:"Hi Nigga"
})

/************************************************************Request Targetting all Articlcs *********************************************************************/
app.route('/articles')    
    .get(function(req, res){
        Article.find(function(err, foundArticles){
            if (!err){
            res.send(foundArticles);
            }else{
                res.send(err);
                console.log(err);
            }
        });
    })
    
    .post(function(req, res){
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save(function(err){
            if (!err){
                res.send("Sucessfully added a new article.");
            }else{
                res.send (err)
            }
        }); 
    })

    .delete(function(req, res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("Sucessfully deleted all articles.");
            }else{
                res.send(err); 
            }
        })
    });
/************************************************************Request Targetting Specific Articlcs ****************************************************************/

app.route('/articles/:articlesTitle')

    .get(function(req, res){
        Article.findOne({title: req.params.articlesTitle}, function(err, foundArticles){
            if (foundArticles){
                res.send(foundArticles);
                console.log("askdfjad;kajsdf")
            }else{
                res.send("No aritcles matching the title was found in the database.");
                console.log(err);
            }
        })
    })

    .put(function(req, res){
        Article.replaceOne(
            {title: req.params.articlesTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err){
                if (!err){
                    res.send("Sucessfully updated the article.")
                }
            }
        )
    })
    
    .patch(function(req, res){
        Article.updateOne(
            {title: req.params.articlesTitle},
            {$set:  req.body},
            function(err){
                if (!err){
                    res.send("Sucessfully updated the article.")
                }
            }
        )
    })

    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articlesTitle},
            function(err){
                if(!err){
                    res.send("deleted the article sucessfully.");
                }else{
                    res.send(err);
                }
            }
        )
    })
app.listen(3000, function() {
    console.log("Server started on port 3000");
});
