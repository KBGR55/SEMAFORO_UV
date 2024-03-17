var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');

const { body, validationResult } = require('express-validator');
const RolController = require('../controls/RolController');
var rolController = new RolController();
const PersonaController = require('../controls/PersonaController');
var personaController = new PersonaController();
const PersonaRolController = require('../controls/PersonaRolController');
var personaRolController = new PersonaRolController();
const CuentaController = require('../controls/CuentaController');
var cuentaController = new CuentaController();
const ComentarioController = require('../controls/ComentarioController');
var comentarioController = new ComentarioController();
const BackendApi= require('../controls/BackendApi');
var backendApiController   = new BackendApi();
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

var auth = function middleware(req, res, next) {
  const token = req.headers['x-api-token'];
  if (token) {
    require('dotenv').config();
    const llave = process.env.KEY;

    jwt.verify(token, llave, async (err, decoded) => {
      if (err) {
        res.status(401);
        res.json({
          msg: "TOKEN NO VALIDO",
          code: 401
        });
      } else {
        var models = require('../models');
        var cuenta = models.cuenta;
        req.decoded = decoded;
        let aux = await cuenta.findOne({ where: { external_id: req.decoded.external } })
        if (aux === null) {
          res.status(401);
          res.json({
            msg: "TOKEN NO VALIDO O EXPIRADO",
            code: 401
          });
        } else {
          next();
        }
      }
    });
  } else {
    res.status(401);
    res.json({
      msg: "NO EXISTE TOKEN",
      code: 401
    });
  }

}
//------------CUENTA-----------
router.post('/cuenta/sesion', [
  body('correo', 'Ingrese un correo').trim().exists().not().isEmpty().isEmail(),
  body('clave', 'Ingrese una clave').trim().exists().not().isEmpty(),
], cuentaController.sesion);
router.post('/cuenta/modificar_estado', cuentaController.modificar_estado);
router.post('/cuenta/estado_aceptado', cuentaController.estado_aceptado);
router.post('/cuenta/estado_rechazado', cuentaController.estado_rechazado);

router.get('/cuenta/obtener/:external_id', cuentaController.obtener);
//------------ROL------------
router.post('/rol/guardar', rolController.guardar);
router.get('/rol/listar', rolController.listar);
router.get('/rol/obtener/:external_id', rolController.obtener);
//------------PERSONA------------
router.post('/persona/guardar', [
  body('apellidos', 'Ingrese sus apellidos').trim().exists().not().isEmpty().isLength({ min: 3, max: 50 }).withMessage("Ingrese un valor mayor o igual a 3 y menor a 50"),
  body('nombres', 'Ingrese sus nombres').trim().exists().not().isEmpty().isLength({ min: 3, max: 50 }).withMessage("Ingrese un valor mayor o igual a 3 y menor a 50"),
], personaController.guardar);
router.post('/persona/admin/guardar', [
  body('apellidos', 'Ingrese sus apellidos').trim().exists().not().isEmpty().isLength({ min: 3, max: 50 }).withMessage("Ingrese un valor mayor o igual a 3 y menor a 50"),
  body('nombres', 'Ingrese sus nombres').trim().exists().not().isEmpty().isLength({ min: 3, max: 50 }).withMessage("Ingrese un valor mayor o igual a 3 y menor a 50"),
], personaController.guardar_admin);
router.get('/persona/listar', personaController.listar);
//------------PERSONA_ROL-----------
router.get('/persona-rol/listar', personaRolController.listar);
//------------COMENTARIO-----------
router.post('/comentario/guardar', comentarioController.AgregarComentario);
router.get('/comentario/listar', comentarioController.ListarComentarios);
router.get('/comentario/clasificacion', comentarioController.ListaNegativosPositivos);
//------------BACKEND_API-----------
router.get('/server/token_api', backendApiController.generar_token);
router.get('/server/dispositivos_activos', backendApiController.obtener_activos);
router.get('/server/dispositivo', backendApiController.obtener_dispositivo);
router.get('/server/medicion_promedio', backendApiController.obtener_medicion_promedio);
router.post('/server/medicion_promedio_dia', backendApiController.obtener_medicion_promedio_dia);
router.get('/server/medicion_dispositivos_dia', backendApiController.obtener_medicion_dispositivos);

module.exports = router;