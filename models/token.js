const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const token = sequelize.define('token', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
    }, {
    freezeTableName: true,
    timestamps: false,
    });

  return token;
};
