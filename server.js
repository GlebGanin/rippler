// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up a static folder (public) for our web app
app.use(express.static("public"));
app.set('view engine', 'ejs');

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "rippler";
var collections = ["rippleNews"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Routes

// 2. At the "/all" path, display every entry in the animals collection
app.get("/all", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  db.rippleNews.find().limit(10, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});


app.post("/new_comment", function(req, res) {
  // console.log(req.body);
  // Insert the note into the notes collection
  db.rippleComments.insert(req.body, function(error, saved) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    else {
      // Otherwise, send the note back to the browser
      // This will fire off the success function of the ajax request
      res.redirect("/");
    }
  });
});


app.get("/delete_comment/:id", function(req, res) {
  // Remove a note using the objectID
  db.rippleNews.remove(
    {
      _id: mongojs.ObjectID(req.params.id)
    },
    function(error, removed) {
      // Log any errors from mongojs
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(removed);

        setTimeout(function () { 
          res.redirect("/");}, 1000);
      }
    }
  );
});



app.get("/scrape_ripple", function(req, res) {
  db.rippleNews.remove({}, function(err) {
    if(err) console.log(err);
  // Make a request for the news section of `ycombinator`
  request("https://ripple.com/category/insights/news/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "title" class
    $(".entry-title").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      var title = $(element).children("a").text();
      var link = $(element).children("a").attr("href");

      // If this found element had both a title and a link
      if (title && link) {
        // Insert the data in the scrapedData db
        db.rippleNews.insert({
          title: title,
          link: link
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
          }
        });
      }
    });
  });
}); 
    setTimeout(function () { 
      res.redirect("/");}, 3000);
    });



// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});


