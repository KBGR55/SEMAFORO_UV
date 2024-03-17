'use strict';

var models = require('../models/');
var rol = models.rol;

class RolController{
    async listar(req,res){
        var data= await rol.findAll({
            attributes:['tipo','external_id','estado']
        });
        res.json({msg:'OK!',code:200,info:data});
    }

    async obtener(req, res) {
        const external = req.params.external_id;
        var data= await rol.findOne({
            where: { external_id: external },
            attributes: ['external_id', 'tipo', 'estado'],
        });        
        if (data === null) {
            data= {};
        }
        res.status(200);
        res.json({ msg: 'OK!', code: 200, info: data});
    }

    async guardar(req, res) {
        try {
            const data = {
                tipo: req.body.tipo 
            };

            let transaction = await models.sequelize.transaction();
            try {
                await models.rol.create(data);
                res.status(200).json({ msg: 'ROL CREADO EXITOSAMENTE', code: 200, info: nuevoRol });
                await transaction.commit();
            } catch (error) {
                if (transaction) await transaction.rollback();
                const errorMsg = error.errors && error.errors[0] && error.errors[0].message
                    ? error.errors[0].message
                    : error.message;
                res.json({ msg: errorMsg, code: 200 });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'ERROR INTERNO DE SERVIDOR', code: 500 });
        }
    }
}

module.exports = RolController;