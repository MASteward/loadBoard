// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const isAuthenticated = require("../config/middleware/isAuthenticated");
let userStatus;



module.exports = (app) => {



  // Using the passport.authenticate middleware with our local strategy.
  app.post("/user/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't auth
    res.json({
      reroute: "/",
      first_name: req.user.first_name,
      id: req.user.id
    })
  });




  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post('/user/new', (req, res) => {
    let { first_name, last_name, email, password } = req.body;
    db.User.create({
      first_name,
      last_name,
      email,
      password
    })
    .then(result => res.redirect(307, "/user/login"))
    .catch(err => res.json(err))
  });


  app.get('/user/profile', isAuthenticated, (req, res) => {
    userStatus = req.user;
    db.Load.findAll({
      where: {
        UserId: userStatus.id
      },
      include: [{
        model: db.Location
      }]
    })
    .then(loads => {
      res.render('profile', {loads, userStatus});
    })
    .catch(err => {
      console.log("Error");
      res.json(err);
    });
  })




  // Route for logging user out
  app.get("/user/logout", function(req, res) {
    userStatus = {};
    req.logout();
    res.redirect("/");
  });




  // Route for getting user data client-side
  app.get("/user/status", function(req, res) {
    // The user is not logged in, send back an empty object
    if (!req.user) {
      res.json({status: false});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        status: true,
        first_name: req.user.first_name,
        id: req.user.id
      });
    }
  });
}
