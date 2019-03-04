module.exports = (sequelize, DataTypes) => {
  const Load = sequelize.define("Load", {
    material: {
      type: DataTypes.STRING,
      allowNull: false
    },
    trailer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    purse: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    license: {
      type: DataTypes.STRING,
      allowNull: true
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  });

  Load.associate = function(models) {
    Load.belongsTo(models.Company, {
      foreignKey: {
        allowNull: false
      }
    });

    Load.hasMany(models.Location, {
      onDelete: "cascade"
    });
  };


  return Load;
}
