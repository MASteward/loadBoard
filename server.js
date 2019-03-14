const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const session = require("express-session");
const passport = require("./config/passport");
const app = express();

const db = require("./models");

const PORT = process.env.PORT || 8080;

// handlebars
// defaultLayout is what every page is wrapped in.
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// Setting up passport and user session
app.use(session({ secret: "keyboard smash", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

require("./routes/html-routes.js")(app);
require("./routes/user-routes.js")(app);
require("./routes/load-routes.js")(app);


db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("App listening on Port: ", PORT);
  });
});
