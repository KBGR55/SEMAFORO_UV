'use strict';
const { UUIDV4 } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const comentario = sequelize.define('comentario', {
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4},
        fecha_publicacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        clasificacion: { type: DataTypes.ENUM("POSITIVO","NEGATIVO")},
        contenido:{ type: DataTypes.STRING(250), defaultValue: "NO_DATA" },
        estado: {type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        freezeTableName: true
    });

    comentario.associate = function (models) {
        comentario.belongsTo(models.persona, {foreignKey: 'id_persona'});
    };

    return comentario;
};
