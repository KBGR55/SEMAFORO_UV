'use strict';
const { body, validationResult, check } = require('express-validator');
var models = require('../models/');
var persona = models.persona;
var rol = models.rol;
var cuenta = models.cuenta;
const bcypt = require('bcrypt');
const persona_rol = models.persona_rol;
const salRounds = 8;

class PersonaRolController {

    async listar(req, res) {
        const listaPersonas = await persona_rol.findAll({
            attributes: ['external_id'],
            include: [
                {
                    model: persona,
                    as: 'persona',
                    attributes: ['apellidos', 'nombres', 'external_id', 'direccion', 'fecha_nacimiento', 'telefono','cargo','institucion'],
                    include: {
                        model: cuenta,
                        as: 'cuenta',
                        attributes: ['external_id','correo','estado']
                    }
                },
                {
                    model: rol,
                    as: 'rol',
                    attributes: ['tipo'],
                    where: {
                        tipo: 'USUARIO'
                    }
                },
            ],
        });
        res.json({ msg: 'OK!', code: 200, info: listaPersonas });
    }

    async obtener(req, res) {
        const listaPersonas = await persona_rol.findAll({
            attributes: ['external_id'],
            include: [
                {
                    model: persona,
                    as: 'persona',
                    attributes: ['apellidos', 'nombres', 'external_id', 'direccion', 'fecha_nacimiento', 'telefono','cargo','institucion'],
                    include: {
                        model: cuenta,
                        as: 'cuenta',
                        attributes: ['external_id','correo','estado']
                    }
                },
                {
                    model: rol,
                    as: 'rol',
                    attributes: ['tipo'],
                },
            ],
        });
        res.json({ msg: 'OK!', code: 200, info: listaPersonas });
    }

}
module.exports = PersonaRolController;