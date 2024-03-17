const { body, validationResult, check } = require('express-validator');
const models = require('../models/');
const backendApi = require('../controls/BackendApi');
const persona = models.persona;
const cuenta = models.cuenta;
const persona_rol = models.persona_rol;
const rol = models.rol;
const bcypt = require('bcrypt');
const SesionToken = require('./token'); // Ajusta la ruta según la ubicación de tu archivo SesionManager
let jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");


class CuentaController {
    getToken() {
        return this.token;
    }
    async sesion(req, res) {
        let errors = validationResult(req);
       
            var login = await cuenta.findOne({
                where: { correo: req.body.correo },
                include: {
                    model: persona,
                    as: 'persona',
                    attributes: ['apellidos', 'nombres', 'external_id']
                }
            });
            if (login === null) {
                res.status(400);
                res.json({
                    msg: "Usuario no registrado en el sistema",
                    code: 400
                });
            } else {
                res.status(200);
                var isClaveValida = function (clave, claveUser) {
                    return bcypt.compareSync(claveUser, clave);
                }
                if (login.estado == "ACEPTADO") {
                    if (isClaveValida(login.clave, req.body.clave)) { //login.clave---BD //req.body.clave---lo que manda el correo
                        const personaId = login.persona.external_id; // Suponiendo que 'external_id' es la clave primaria de la tabla persona
                        const personaAsociado = await persona.findOne({
                            where: { external_id: personaId },
                            include: [{
                                model: persona_rol,
                                as: 'persona_rol',
                                attributes: ['external_id']
                            }]
                        });
                        const rolAsociado = await persona_rol.findOne({
                            where: { external_id: personaAsociado.persona_rol[0].external_id },
                            include: [{
                                model: rol,
                                as: 'rol',
                                attributes: ['tipo']
                            }]
                        });
                        const tokenData = {
                            external: login.external_id,
                            correo: login.correo,
                            nombres: login.persona.nombres,
                            apellidos: login.persona.apellidos,
                            check: true
                        };
                        SesionToken.setExternal(tokenData.external);
                        require('dotenv').config();
                        const llave = process.env.KEY_SQ;
                        const token = jwt.sign(tokenData, llave, {
                            expiresIn: '24h' // Por ejemplo, un token válido por 24 horas
                        });
                        SesionToken.setToken(token);
                        console.log("IIIIIIIIII"+login.token);
                        res.json({
                            token: token,
                            user: login.persona.nombres + ' ' + login.persona.apellidos,
                            msg: "Bienvenid@ " + login.persona.nombres + ' ' + login.persona.apellidos,
                            correo: login.correo,
                            rol: rolAsociado.rol.tipo,
                            tokenApi: login.token,
                            info: login,
                            code: 200
                        });
                    } else {
                        res.json({
                            msg: "CLAVE INCORRECTA",
                            code: 201
                        });
                    }
                } else if (login.estado == "RECHAZADO") {
                    res.json({
                        msg: "PETICION DE ACCESO RECHAZADA",
                        code: 201
                    });
                } else if (login.estado == "ESPERA") {
                    res.json({
                        msg: "PETICION DE ACCESO EN ESPERA",
                        code: 201
                    });
                } else {
                    res.json({
                        msg: "NO EXISTE ESA CUENTA",
                        code: 201
                    });
                }
            }
      
    }
    async obtener(req, res) {
        const external_id = req.params.external_id;
        var cuenta_persona = await cuenta.findOne({
            where: { external_id: external_id },
            attributes: ['external_id', 'correo', 'estado'],
        });
        if (cuenta_persona === null) {
            cuenta_persona = {};
        }
        res.status(200);
        res.json({ msg: 'OK!', code: 200, info: cuenta_persona });
    }
    async modificar_estado(req, res) {

        var cuenta_persona = await cuenta.findOne({ where: { external_id: req.body.external_id } });

        if (cuenta_persona === null) {
            res.status(400);
            res.json({
                msg: "NO EXISTEN REGISTROS",
                code: 400
            });
        } else {
            var uuid = require('uuid');
            cuenta_persona.estado = req.body.estado;

            cuenta_persona.external_id = uuid.v4();

            try {
                await cuenta_persona.save();

                res.status(200);
                if (cuenta_persona.estado == "ACEPTADO") {
                    const backend = new backendApi();
                    await backend.generar_token();
                    const tokenapi = SesionToken.gettokenApi();
                    cuenta_persona.token = tokenapi;
                    await cuenta_persona.save();

                    res.json({
                        msg: "LA CUENTA HA SIDO ACEPTADA ",
                        code: 200
                    });
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
                    const mailOptions = {
                        from: "SemaforoUV",
                        to: cuenta_persona.correo,
                        subject: "😄🚦 ¡Felicidades Solicitud Aprobada! 😄🚦",
                        text: "!Tu solicitud ha sido ACEPTADA ahora puedes hacer uso de nuestra API!",
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        try {
                            console.log("Correo electrónico enviado: " + info.response);

                        } catch (error) {
                            console.log(error);
                            res.json({
                                msg: "HUBO UN ERROR AL ENVIAR EL CORREO",
                                code: 500
                            });
                        }
                    });
                } else if (cuenta_persona.estado == "RECHAZADO") {
                    res.json({
                        msg: "LA CUENTA HA SIDO RECHAZADA ",
                        code: 200
                    });
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
                    const mailOptions = {
                        from: "SemaforoUV",
                        to: cuenta_persona.correo,
                        subject: "😢🚦 ¡Solicitud Rechazada! 😢🚦",
                        text: "Lamentamos informarte que tu solicitud ha sido RECHAZADA. Para más detalles, por favor, contacta con el equipo de soporte.",
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        try {
                            console.log("Correo electrónico enviado: " + info.response);

                        } catch (error) {
                            console.log(error);
                            res.json({
                                msg: "HUBO UN ERROR AL ENVIAR EL CORREO",
                                code: 500
                            });
                        }


                    });
                } else {
                    res.json({
                        msg: "NO SE HA GENERADO NINGUN CAMBIO...",
                        code: 200
                    });
                }
            } catch (error) {
                res.status(400);
                res.json({
                    msg: "NO SE HA MODIFICADO EL ESTADO DE LA CUENTA",
                    code: 400,
                    error: error.message
                });

            }
        }
    }

    async estado_aceptado(req, res) {

        var cuenta_persona = await cuenta.findOne({ where: { external_id: req.body.external_id } });
        if (cuenta_persona === null) {
            res.status(400);
            res.json({
                msg: "NO EXISTEN REGISTROS",
                code: 400
            });
        } else {
            var uuid = require('uuid');
            console.log(cuenta_persona);
            cuenta_persona.estado = "ACEPTADO";
            cuenta_persona.external_id = uuid.v4();
            try {
                await cuenta_persona.save();
                res.status(200);
                if (cuenta_persona.estado == "ACEPTADO") {
                    res.json({
                        msg: "LA CUENTA HA SIDO ACEPTADA EXITOSAMENTE",
                        code: 200
                    });
                }
            } catch (error) {
                res.status(400);
                res.json({
                    msg: "NO SE HA MODIFICADO EL ESTADO DE LA CUENTA",
                    code: 400,
                    error: error.message
                });
            }
        }
    }

    async estado_rechazado(req, res) {

        var cuenta_persona = await cuenta.findOne({ where: { external_id: req.body.external_id } });
        if (cuenta_persona === null) {
            res.status(400);
            res.json({
                msg: "NO EXISTEN REGISTROS",
                code: 400
            });
        } else {
            var uuid = require('uuid');
            console.log(cuenta_persona);
            cuenta_persona.estado = "RECHAZADO";
            cuenta_persona.external_id = uuid.v4();
            try {
                await cuenta_persona.save();
                res.status(200);
                if (cuenta_persona.estado == "RECHAZADO") {
                    res.json({
                        msg: "LA CUENTA HA SIDO RECHAZADA ",
                        code: 200
                    });
                }
            } catch (error) {
                res.status(400);
                res.json({
                    msg: "NO SE HA MODIFICADO EL ESTADO DE LA CUENTA",
                    code: 400,
                    error: error.message
                });
            }
        }
    }


}
module.exports = CuentaController;