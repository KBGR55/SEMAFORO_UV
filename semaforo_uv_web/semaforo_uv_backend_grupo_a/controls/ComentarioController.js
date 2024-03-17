let jwt = require('jsonwebtoken');
const SesionToken = require('./token');
var models = require('../models/');
var comentario = models.comentario;
var cuenta = models.cuenta;
var persona = models.persona;
class ComentarioController {
    async ListaNegativosPositivos(req, res) {
        try {
            const comentarios = await comentario.findAll({
                attributes: ['contenido', 'fecha_publicacion', 'clasificacion'],
                include: {
                    model: persona,
                    as: 'persona',
                    attributes: ['nombres', 'apellidos']
                }
            });

            // Contar la cantidad de comentarios positivos y negativos
            const cantidadPositivos = comentarios.filter(comment => comment.clasificacion === 'POSITIVO').length;
            const cantidadNegativos = comentarios.filter(comment => comment.clasificacion === 'NEGATIVO').length;

            // Mostrar resultados por consola
            console.log('Cantidad de comentarios positivos:', cantidadPositivos);
            console.log('Cantidad de comentarios negativos:', cantidadNegativos);


            res.json({ msg: 'OK!', code: 200, info: comentarios, CN: cantidadNegativos, CP: cantidadPositivos });
        } catch (error) {
            console.error('Error al listar comentarios:', error);
            res.status(500).json({ msg: 'Error interno del servidor', code: 500 });
        }
    }
    async ListarComentarios(req, res) {
        var listar = await comentario.findAll({
            attributes: ['contenido', 'fecha_publicacion', 'clasificacion'],
            include: {
                model: persona,
                as: 'persona',
                attributes: ['nombres', 'apellidos']
            }
            
        });
      
        res.json({ msg: 'OK!', code: 200, info: listar });
    }
    async AgregarComentario(req, res) {
        try {
            const token = SesionToken.getToken();
            const external = SesionToken.getExternal();
            const comentariorecibido = req.body.comentario;
            const clasificacion = req.body.clasificacion;

            // Verificar y decodificar el token
            const decodedToken = jwt.verify(token, process.env.KEY_SQ);
            const nombres = decodedToken.nombres;
            const apellidos = decodedToken.apellidos;
            if (clasificacion == "N+" || clasificacion == "N") {
                const clasificacionN = "NEGATIVO";
                var id = await cuenta.findOne({
                    where: { external_id: external },
                    attributes: ['id_persona'],
                });

                const data = {
                    clasificacion: clasificacionN,
                    contenido: comentariorecibido,
                    id_persona: id.id_persona
                };
                let transaction = await models.sequelize.transaction();
                try {
                    await comentario.create(data);
                    res.status(200).json({ msg: 'Su comentario ha sido publicado', code: 200 });
                    await transaction.commit();
                } catch (error) {
                    if (transaction) await transaction.rollback();
                    const errorMsg = error.errors && error.errors[0] && error.errors[0].message
                        ? error.errors[0].message
                        : error.message;
                    res.json({ msg: errorMsg, code: 200 });
                }

            } else if (clasificacion == "P+" || clasificacion == "P") {

                const clasificacionP = "POSITIVO";
                var id = await cuenta.findOne({
                    where: { external_id: external },
                    attributes: ['id_persona'],
                });

                const data = {
                    clasificacion: clasificacionP,
                    contenido: comentariorecibido,
                    id_persona: id.id_persona
                };
                let transaction = await models.sequelize.transaction();
                try {
                    await comentario.create(data);
                    res.status(200).json({ msg: 'Su comentario ha sido publicado', code: 200 });
                    await transaction.commit();
                } catch (error) {
                    if (transaction) await transaction.rollback();
                    const errorMsg = error.errors && error.errors[0] && error.errors[0].message
                        ? error.errors[0].message
                        : error.message;
                    res.json({ msg: errorMsg, code: 200 });
                }
            } else if (clasificacion == "undefined") {
                res.status(200).json({ msg: 'No se ha analizado', code: 200 });
            }

        } catch (error) {

            if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
                res.status(401).json({
                    msg: "Token inválido o expirado",
                    code: 401,
                });
            } else {
                // Manejar otros errores
                console.error(`Error en la función AgregarComentario: ${error.message}`);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        }
    }
}

module.exports = ComentarioController;
