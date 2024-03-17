'use strict';
const { UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const cuenta = sequelize.define('cuenta', {
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4},
        estado: {type: DataTypes.ENUM("ESPERA","ACEPTADO","RECHAZADO"), defaultValue: "ESPERA"},
        correo: { type: DataTypes.STRING(75), allowNull: false },
        clave: { type: DataTypes.STRING(250), allowNull: false },
        token: { type: DataTypes.STRING(250), allowNull: true }
    }, {
        freezeTableName: true
    });

    cuenta.associate = function (models){
        cuenta.belongsTo(models.persona, {foreignKey: 'id_persona'});
    }

    return cuenta;
};