const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const internjobs = sequelize.define('internjobs', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    posisi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    perusahaan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lokasi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deskripsi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tenggat: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
    },
    panduan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipe: {
        type: DataTypes.ENUM,
        values: ['standar','professional'],
        allowNull: false
    },
    jenis: {
        type: DataTypes.ENUM,
        values: ['part time','full time'],
        allowNull: false
    }
    }, {
    freezeTableName: true,
    });

    internjobs.associate = function(models) {
        internjobs.belongsToMany(models.student, { through: models.apply } );
        internjobs.belongsTo(models.employee);
    };

    return internjobs;
};
