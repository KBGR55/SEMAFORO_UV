'use strict';
const { body, validationResult, check } = require('express-validator');
var models = require('../models/');
var persona = models.persona;
var rol = models.rol;
var cuenta = models.cuenta;
const bcypt = require('bcrypt');
const salRounds = 8;
//Importando la biblioteca nodemailer en tu archivo
const nodemailer = require("nodemailer");

class PersonaController {

    async listar(req, res) {
        var listar = await persona.findAll({
            attributes: ['apellidos', 'nombres', 'external_id', 'direccion', 'fecha_nacimiento', 'telefono', 'direccion', 'cargo', 'institucion'],
            include: {
                model: cuenta,
                as: 'cuenta',
                attributes: ['external_id', 'correo', 'estado']
            }
        });
        res.json({ msg: 'OK!', code: 200, info: listar });
    }
    async guardar(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.status(400).json({ msg: "DATOS FALTANTES", code: 400, errors: errors });
                return;
            }

            const rol = await models.rol.findOne({
                where: { tipo: 'USUARIO' },
                attributes: ['external_id']
            });

            if (!rol || !rol.external_id) {
                res.status(400).json({ msg: "DATOS INCORRECTOS", code: 400 });
                return;
            }

            const rolAux = await models.rol.findOne({
                where: { tipo: 'USUARIO' },
                attributes: ['id']
            });

            const claveHash = (clave) => bcypt.hashSync(clave, bcypt.genSaltSync(salRounds), null);

            const correoAux = req.body.correo;

            // Validar Datos duplicados en la Base de datos
            const correoExistente = await models.cuenta.findOne({ where: { correo: correoAux } });
            const telefonoExistente = await models.persona.findOne({ where: { telefono: req.body.telefono } });

            if (correoExistente || telefonoExistente) {
                res.json({ msg: "Correo o Telefono ya existente", code: 500 });
                return;
            }

            const data = {
                nombres: req.body.nombres,
                apellidos: req.body.apellidos,
                direccion: req.body.direccion,
                fecha_nacimiento: req.body.fecha_nacimiento,
                telefono: req.body.telefono,
                cargo: req.body.cargo,
                institucion: req.body.institucion,
                persona_rol: { id_rol: rolAux.id },
                cuenta: { correo: req.body.correo, clave: claveHash(req.body.clave) }
            };

            console.log(data);

            let transaction = await models.sequelize.transaction();
            try {
                // Configuración del servicio de correo electrónico
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "semaforouv@gmail.com",
                        pass: "iydm zpvz wkqt kxel",
                    },
                });

                // Definir el contenido del cuerpo para el correo electrónico que deseas enviar
                const correo = req.body.correo;
                const mailOptions = {
                    from: "SemaforoUV",
                    to: [correo],
                    subject: "🚦😊 ¡Te has registrado en SemaforoUV! 😊🚦",
                    text: "!Por medio de este correo te haremos saber el estado de tu solicitud, mientras tanto se encuentra en ESPERA!",
                };

                // Envía el correo electrónico utilizando async/await
                const info = await transporter.sendMail(mailOptions);

                // Verificar si el correo se envió correctamente
                if (info && info.messageId) {
                    // Crear usuario en la base de datos solo si el correo se envía correctamente
                    await models.persona.create(data, {
                        include: [
                            { model: models.cuenta, as: "cuenta" },
                            { model: models.persona_rol, as: "persona_rol" }
                        ],
                        transaction
                    });

                    await transaction.commit();
                    console.log("Correo electrónico enviado");
                    res.json({
                        msg: "Su solicitud ha sido enviada, porfavor revise su correo",
                        code: 200
                    });
                } else {
                    console.log("Error al enviar el correo electrónico");
                    res.json({
                        msg: "HUBO UN ERROR AL ENVIAR EL CORREO",
                        code: 500
                    });
                }
            } catch (error) {
                if (transaction) await transaction.rollback();
                const errorMsg = error.errors && error.errors[0] && error.errors[0].message
                    ? error.errors[0].message
                    : error.message;
                console.error(errorMsg);

                if (error.code === "ETIMEDOUT") {
                    console.error("Tiempo de espera de conexión agotado. Verifica la conectividad a Internet y la configuración del servidor de correo.");
                    res.json({ msg: "Error de conexión al servidor de correo", code: 500 });
                } else {
                    const errorMsg = error.errors && error.errors[0] && error.errors[0].message
                        ? error.errors[0].message
                        : error.message;
                    console.error(errorMsg);
                    res.json({ msg: errorMsg, code: 500 });
                }
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }
    async guardar_admin(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.status(400).json({ msg: "DATOS FALTANTES", code: 400, errors: errors });
                return;
            }

            const rol = await models.rol.findOne({
                where: { tipo: 'ADMINISTRADOR' },
                attributes: ['external_id']
            });

            if (!rol || !rol.external_id) {
                res.status(400).json({ msg: "DATOS INCORRECTOS", code: 400 });
                return;
            }

            const rolAux = await models.rol.findOne({
                where: { tipo: 'ADMINISTRADOR' },
                attributes: ['id']
            });

            const claveHash = (clave) => bcypt.hashSync(clave, bcypt.genSaltSync(salRounds), null);

            const correoAux = req.body.correo;

            // Validar Datos duplicados en la Base de datos
            const correoExistente = await models.cuenta.findOne({ where: { correo: correoAux } });
            const telefonoExistente = await models.persona.findOne({ where: { telefono: req.body.telefono } });

            if (correoExistente || telefonoExistente) {
                res.json({ msg: "Correo o Telefono ya existente", code: 500 });
                return;
            }

            const data = {
                nombres: req.body.nombres,
                apellidos: req.body.apellidos,
                direccion: req.body.direccion,
                fecha_nacimiento: req.body.fecha_nacimiento,
                telefono: req.body.telefono,
                cargo: req.body.cargo,
                institucion: req.body.institucion,
                persona_rol: { id_rol: rolAux.id },
                cuenta: { correo: req.body.correo, clave: claveHash(req.body.clave), estado: 'ACEPTADO' }
            };

            console.log(data);

            let transaction = await models.sequelize.transaction();

            try {
                // Crear usuario en la base de datos

                //Importando la biblioteca nodemailer en tu archivo

                // Configuración del servicio de correo electrónico
                const transporter = nodemailer.createTransport({
                    /**
                     * Para utilizar otro servicio de correo electrónico, como Yahoo o Outlook, debes
                     * cambiar el valor de la propiedad service y ajustar la configuración de autenticación correspondiente.
                     */
                    service: "gmail",
                    auth: {
                        user: "semaforouv@gmail.com",
                        pass: "iydm zpvz wkqt kxel",
                    },
                });

                // Definir el contenido del cuepro para el correo electrónico que deseas enviar
                const correo = req.body.correo;
                const mailOptions = {
                    from: "SemaforoUV",
                    to: [correo],
                    subject: "🚦😊 ¡Te has registrado en SemaforoUV! 😊🚦",
                    text: "!Por medio de este correo te haremos saber el estado de tu solicitud, mientras tanto se encuentra en ESPERA!",
                };

                // Envía el correo electrónico utilizando el método sendMail del objeto transporter
                transporter.sendMail(mailOptions, function (error, info) {
                    try {
                        console.log("Correo electrónico enviado: ");
                        res.json({
                            msg: "POR FAVOR REVISE SU CORREO ELECTRÓNICO Y ESPERE EL ACCESO AL SISTEMA",
                            code: 200
                        });
                    } catch (error) {
                        console.log(error);
                        res.json({
                            msg: "HUBO UN ERROR AL ENVIAR EL CORREO",
                            code: 500
                        });
                    }


                });
                await models.persona.create(data, {
                    include: [
                        { model: models.cuenta, as: "cuenta" },
                        { model: models.persona_rol, as: "persona_rol" }
                    ],
                    transaction
                });

                await transaction.commit();
                // Envía un mensaje de éxito sin mencionar el correo electrónico

            } catch (error) {
                if (transaction) await transaction.rollback();
                const errorMsg = error.errors && error.errors[0] && error.errors[0].message
                    ? error.errors[0].message
                    : error.message;
                res.json({ msg: errorMsg, code: 200 });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }
}
module.exports = PersonaController;