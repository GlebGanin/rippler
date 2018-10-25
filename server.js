//QUESTIONS FOR TA's

// I want to have the second button only activate after LinkedIn is connected. How do I call a function from app.js in server.js? I am getting a $ error.

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var app = express();

var Linkedin = require("node-linkedin")(
  "78r998wpzh7dsp",
  "qOgsksswIkhRkgjX",
  "http://localhost:3000/profile_builder/linkedin"
);

var scope = ["r_basicprofile"];

var session = require("express-session");
//allow sessions SETS A TIMER FOR HOW LONG THE SESSION WILL STAY ACTIVE:
app.use(
  session({ secret: "app", cookie: { maxAge: 1 * 1000 * 60 * 60 * 24 * 365 } })
);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up a static folder (public) for our web app
app.use(express.static("public"));
app.set("view engine", "ejs");

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "digume_db";
var collections = ["users"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// function activate() {
//   setTimeout(function () {
//     $('#load_linkedin').removeClass('disabled');
//   }, 1500);
// };

app.get("/", function(req, res) {
  res.render("pages/index");
});

app.get("/profile_builder", function(req, res) {
  res.render("pages/profile_builder");
});

app.get("/oauth/linkedin", function(req, res) {
  // This will ask for permisssions etc and redirect to callback url.
  Linkedin.auth.authorize(res, scope);
});

app.get("/profile_builder/linkedin", function(req, res) {
  Linkedin.auth.getAccessToken(res, req.query.code, req.query.state, function(
    err,
    results
  ) {
    if (err) return console.error(err);
    console.log(results.access_token);
    req.session.access_token = results.access_token;

    db.token.insert(
      {
        token: results.access_token
      },
      function(error, user) {
        if (error) {
          res.send(error);
        } else {
          console.log("token has been saved!");
        }
      }
    );

    return res.redirect("/profile_builder");
  });

  // activate();
});

app.get("/load_user_info", function(req, res) {
  var linkedin = Linkedin.init(req.session.access_token);

  linkedin.people.me(
    [
      "first-name",
      "last-name",
      "location",
      "picture-url",
      "industry",
      "headline",
      "positions"
    ],
    function(err, in_info) {
      // Loads the profile of access token owner.
      console.log(in_info);
      req.session.first_name = in_info.firstName;
      req.session.last_name = in_info.lastName;
      req.session.location = in_info.location.name;
      req.session.headline = in_info.headline;
      req.session.industry = in_info.industry;
      req.session.picture_url = in_info.pictureUrl;
      req.session.headline = in_info.headline;

      req.session.current_company = in_info.positions.values[0].company.name;
      req.session.current_title = in_info.positions.values[0].title;
      req.session.current_industry =
        in_info.positions.values[0].company.industry;
      req.session.company_size = in_info.positions.values[0].company.size;
      req.session.company_ownership = in_info.positions.values[0].company.type;
      req.session.company_location = in_info.positions.values[0].location;
      req.session.start_date = in_info.positions.values[0].location;
      req.session.company_summary = in_info.positions.values[0].summary;
    }
  );

  setTimeout(function() {
    return res.redirect("/profile");
  }, 2500);
});

app.post("/create_profile", function(req, res) {
  req.session.username = req.body.username;
  req.session.password = req.body.password;

  user_password = req.session.password;
  user_username = req.session.username;

  console.log(req.body);

  db.users.insert(
    {
      username: user_username,
      password: user_password
    },
    function(error, user) {
      // Log any errors
      if (error) {
        res.send(error);
      } else {
        console.log("successfully signed up");
      }
    }
  );
  res.redirect("/profile");
});

app.post("/login", function(req, res) {
  db.users.findOne(
    {
      username: req.body.username
    },
    function(error, result) {
      if (!result) return res.status(404).json({ error: "user not found" });

      if (!bcrypt.compareSync(req.body.password, result.password))
        return res.status(401).json({ error: "incorrect password " });

      var payload = {
        _id: result._id,
        username: result.username
      };

      var token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "4h"
      });

      return res.json({
        message: "successfuly authenticated",
        token: token
      });
    }
  );

  res.redirect("/profile");
});

app.get("/profile", function(req, res) {
  res.render("pages/profile");
});

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
