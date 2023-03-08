const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const employee = sequelize.define('employee', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    perusahaan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    limit: {
        type: DataTypes.INTEGER,
        defaultValue: '3',
    }
    }, {
    freezeTableName: true,
    });

    employee.associate = function(models) {
        employee.hasMany(models.internjobs);
    };

    return employee;
};
