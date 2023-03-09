const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const student = sequelize.define('student', {
    nim: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        unique: true,
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
        allowNull: false
    },
    noTelp: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    domisili: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    universitas: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prodi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nik: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tahunMasuk: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.STRING
    },
    skills: {
        type: DataTypes.STRING
    },
    expertise: {
        type: DataTypes.STRING
    },
    photo: {
        type: DataTypes.STRING
    },
    sertifikat: {
        type: DataTypes.STRING
    },
    cv: {
        type: DataTypes.STRING
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
    }, {
    freezeTableName: true
    });

    student.associate = function(models) {
        student.belongsToMany(models.internjobs, { through: models.apply } );
        student.hasMany(models.videos);
    };

    return student;
};
