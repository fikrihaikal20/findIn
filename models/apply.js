const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const apply = sequelize.define('apply', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    cv: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    resume: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
    }
    }, {
    freezeTableName: true,
    });

    apply.associate = function(models) {
        apply.belongsTo(models.internjobs);
        apply.belongsTo(models.student);
    };

  return apply;
};
