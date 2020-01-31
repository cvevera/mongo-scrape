var express = require("express");
var mongoose = require("mongoose");


var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/GameScrape", { useNewUrlParser: true });


app.get("/scrape", function(req, res) {
  axios.get("http://www.gamespot.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    $("article").each(function(i, element) {
        var result = {};

        var title = $(this).find("h3").text();
        var link = $(this).find("a").attr("href");
        var image = $(this).find("img").attr("src");
        var summary = $(this).find("p").text();
    
        result.title = title
        result.link = link
        result.image = image
        result.summary = summary

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    res.redirect("/");
  });
});

app.get("/articles", function(req, res) {
  db.Article.find({})
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
  .populate("comment")
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.post("/articles/:id", function(req, res) {
  db.Comments.create(req.body)
  .then(function(dbComment) {
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.post("/articles/:id", function(req, res) {
    db.Comments.findByIdAndDelete(req.body)
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
  });

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
