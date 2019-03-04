const db = require("../models");

module.exports = function(app) {

  // Get all loads
  app.get("/loads", (req, res) => {
    db.Load.findAll({
      include:[{
        model: db.Location
      }]
    })
    .then(loads => {
      res.render('loads', { loads });
    })
    .catch(err => console.log(err))
  });

  // Display add load form
  app.get("/add", (req, res) => res.render("add"));

  app.get("/details/:id", (req, res) => {
    db.Load.findOne({
      where: {
        id: req.params.id
      },
      include:[{
        model: db.Location,
        // where: {
        //   LoadId: req.params.id
        // }
      }]
    })
    .then(details => {
      res.render('details', { details });
    })
    .catch(err => console.log(err))
  })
  // Add a load
  app.post("/add", (req, res) => {
    let { company, load_type, pickup_location, dropoff_location, purse, deadline } = req.body;
    let errors = [];

    if (!company) {
      errors.push({text: 'Please add a company name'});
    }
    if (!load_type) {
      errors.push({text: 'Please add a load type'});
    }
    if (!pickup_location) {
      errors.push({text: 'Please add a pickup location'});
    }
    if (!dropoff_location) {
      errors.push({text: 'Please add a dropoff location'});
    }
    if (!purse) {
      errors.push({text: 'Please add a payment amount'});
    }
    if (!deadline) {
      errors.push({text: 'Please add a deliver by date'})
    }

    // Check for errors
    if (errors.length > 0) {
      res.render('add', {
        errors,
        company,
        load_type,
        pickup_location,
        dropoff_location,
        purse,
        deadline
      })
    } else {
      purse = parseFloat(purse).toFixed(2);
      // Insert into table
      db.Load.create({
        company,
        load_type,
        pickup_location,
        dropoff_location,
        purse,
        deadline
      })
      .then(result => res.redirect("/loads"))
      .catch(err => console.log(err))
    }
  });

  app.get('/search', (req, res) => {
    let { term } = req.query;
    term = term.toLowerCase();

    db.Load.findAll({
      where: {
        load_type: {
          like: term
        }
      }
    })
    .then(loads => res.render('loads', { loads }))
    .catch(err => console.log(err));
  })
}
