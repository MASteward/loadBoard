// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");
let userStatus;
module.exports = (app) => {

  app.get("/", (req, res) => {
    userStatus = req.user;
    res.render("index", {userStatus});
  });

  app.get("/add", isAuthenticated, (req, res) => {
    userStatus = req.user;
    res.render("add", {userStatus});
  });

  app.get('/signup', (req, res) => {
    userStatus = req.user;
    res.render('signup', {userStatus});
  });



}
