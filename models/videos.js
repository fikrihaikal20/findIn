const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const videos = sequelize.define('videos', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    video: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
    }, {
    freezeTableName: true,
    timestamps: false,
    });

    videos.associate = function(models) {
        videos.belongsTo(models.student);
    };

  return videos;
};
