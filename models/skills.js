const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const skills = sequelize.define('skills', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
    }, {
    freezeTableName: true,
    timestamps: false,
    });

    skills.associate = function(models) {
        skills.belongsTo(models.expertise);
    };

  return skills;
};
