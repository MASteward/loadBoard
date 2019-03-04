module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define("Location", {
    street: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    },
    pickup: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });

  Location.associate = (models) => {
    Location.belongsTo(models.Load, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Location;
}
