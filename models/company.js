const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define("Company", {
    name : {
      type: DataTypes.STRING,
      allowNull: false
    },
    email : {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password : {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  // Creating a custom method for our Company model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  Company.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the Company Model lifecycle
  // In this case, before a Company is created, we will automatically hash their password
  Company.hook("beforeCreate", function(company) {
    company.password = bcrypt.hashSync(company.password, bcrypt.genSaltSync(10), null);
  });

  Company.associate = function(models) {
    // We're saying that a Loads should belong to an Company(Admin).
    // A Loads can't be created without an Company(Admin) due to the foreign key constraint
    Company.hasMany(models.Load, {
      onDelete: "cascade"
    });
  };

  return Company;
}
