const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const expertise = sequelize.define('expertise', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
    }
    }, {
    freezeTableName: true,
    timestamps: false,
    });

    expertise.associate = function(models) {
        expertise.hasMany(models.skills);
      };

  return expertise;
};
