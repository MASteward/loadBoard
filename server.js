const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");

const app = express();

const db = require("./models");

const PORT = process.env.PORT || 8080;

// handlebars
// defaultLayout is what every page is wrapped in.
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

//set static folder
app.use(express.static(path.join(__dirname, "public")));

// app.use("/loads", require("./routes/loads"));
app.get("/", (req, res) => res.render("index"));

require("./routes/loads.js")(app);

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("App listening on Port: ", PORT);
  });
});
