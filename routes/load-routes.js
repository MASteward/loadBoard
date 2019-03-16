const db = require("../models");
const passport = require("../config/passport");
let userStatus;

module.exports = function(app) {

  // Get all loads
  app.get("/loads", (req, res) => {
    userStatus = req.user;
    db.Load.findAll({
      include:[{
        model: db.Location
      }]
    })
    .then(loads => {
      res.render('loads', { loads, userStatus });
    })
    .catch(err => console.log(err))
  });

  app.get("/details/:id", (req, res) => {
    userStatus = req.user;
    db.Load.findOne({
      where: {
        id: req.params.id
      },
      include:[{
        model: db.Location
      }]
    })
    .then(details => {
      // res.json(details)
      res.render('details', { details, userStatus });
    })
    .catch(err => console.log(err))
  });


  // Add a load
  app.post("/add", (req, res) => {
    let { material, trailer, purse, license, instructions, deadline, street, city, state, zip, pickup } = req.body;
    material = material.toLowerCase();
    trailer = trailer.toLowerCase();
    license = license.toLowerCase();
    if (req.user) {
      db.Load.create({
        material,
        trailer,
        purse,
        license,
        instructions,
        deadline,
        UserId: req.user.id
      })
      .then( data => {
        db.Location.bulkCreate([
          {
            street: street[0],
            city: city[0],
            state: state[0],
            zip: zip[0],
            pickup: pickup[0],
            LoadId: data.id
          },
          {
            street: street[1],
            city: city[1],
            state: state[1],
            zip: zip[1],
            pickup: pickup[1],
            LoadId: data.id
          }
        ])

      })
      .then(result => res.redirect("/loads"))
      .catch(err => console.log(err))
    }
  });

  app.get('/search', (req, res, next) => {
    userStatus = req.user;
    let { term, category } = req.query;
    if (!term) {
      res.redirect('/loads');
    } else {
      let locationIds;
      if (category == "material" || category == "trailer") {
        db.Load.findAll({
          where: {
            [category]: {
              like: [term]
            }
          },
          include: {
            model: db.Location
          }
        })
        .then(loads => res.render('loads', { loads, userStatus }))
        .catch(err => console.log(err));
      } else {
        let isPickup;
        if (category == "true") {
          isPickup = true;
        } else {
          isPickup = false;
        }
        db.Location.findAll({
          where: {
            city: term,
            pickup: isPickup
          }
        })
        .then(locations => {
          locationIds = locations.map(location => location.LoadId);
          db.Load.findAll({
            where: {
              id:locationIds
            },
            include: {
              model: db.Location
            }
          })
          .then(loads => {
            res.render('loads', { loads, userStatus })
          })
        })
        .catch(err => console.log(err));
      }
    }

  });


  app.post('/delete', (req, res) => {

    db.Load.destroy({
      where: {
        id: req.body.id,
        UserId: req.user.id
      }
    })
    .then( result => res.redirect('/user/profile'))
    .catch(err => res.json(err));
  });

}


//   let { company, load_type, pickup_location, dropoff_location, purse, deadline } = req.body;
//   let errors = [];
//
//   if (!company) {
//     errors.push({text: 'Please add a company name'});
//   }
//   if (!load_type) {
//     errors.push({text: 'Please add a load type'});
//   }
//   if (!pickup_location) {
//     errors.push({text: 'Please add a pickup location'});
//   }
//   if (!dropoff_location) {
//     errors.push({text: 'Please add a dropoff location'});
//   }
//   if (!purse) {
//     errors.push({text: 'Please add a payment amount'});
//   }
//   if (!deadline) {
//     errors.push({text: 'Please add a deliver by date'})
//   }
//
//   // Check for errors
//   if (errors.length > 0) {
//     res.render('add', {
//       errors,
//       company,
//       load_type,
//       pickup_location,
//       dropoff_location,
//       purse,
//       deadline
//     })
//   } else {
//     // purse = parseFloat(purse).toFixed(2);
//     // Insert into table
//     db.Load.create({
//       company,
//       load_type,
//       pickup_location,
//       dropoff_location,
//       purse,
//       deadline
//     })
//     .then(result => res.redirect("/loads"))
//     .catch(err => console.log(err))
//   }
