import React, { useState, useEffect } from 'react';
import '../css/style.css';
import Footer from './Footer';
import BarraMenu from './BarraMenu';
import { useNavigate } from "react-router";
import { PeticionGet } from '../hooks/Conexion';
import { borrarSesion, getToken } from '../utilidades/Sessionutil';
import mensajes from '../utilidades/Mensajes';
import { Button, Modal } from 'react-bootstrap';
import CambiarEstado from './CambiarEstado';

const PeticionApi = () => {
  const [data, set_data] = useState([]);
  const navegation = useNavigate();
  const [lista_usuarios, set_lista_usuarios] = useState(false);
  const [usuario, set_usuario] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar si se está cargando o no

  //SHOW CAMBIAR ESTADO
  const [showChance, setShowChance] = useState(false);
  const handleShowChance = () => setShowChance(true);
  const handleCloseChance = () => setShowChance(false);

  useEffect(() => {
    if (!lista_usuarios) {
      setIsLoading(true); // Marcar como cargando antes de enviar la solicitud
      PeticionGet(getToken(), "persona-rol/listar").then((info) => {
        setIsLoading(false); // Marcar como no cargando después de recibir la respuesta
        if (info.code !== 200 && info.msg === 'Acceso denegado. Token a expirado') {
          borrarSesion();
          mensajes(info.mensajes);
          navegation("/");
        } else {
          // Filtrar usuarios cuyo estado no sea "RECHAZADO"
          const filteredData = info.info.filter(estudiante => estudiante.persona.cuenta.estado !== "RECHAZADO");
          set_data(filteredData);
          set_lista_usuarios(true);
        }
      });
    }
  }, [lista_usuarios, navegation]);

  //ACCION OBTENER DATOS DE UN AUTO
  const obtenerIdCuenta = (id) => {
    PeticionGet(getToken(), `cuenta/obtener/${id}`).then((info) => {
      var datos = info.info;
      if (info.code !== 200) {
        mensajes(info.mensajes);
      } else {
        console.log(datos);
        set_usuario(datos);
      }
    });
  };

  //ACCION HABILITAR EDICION CAMPOS
  const handleChange = e => {
    const { name, value } = e.target;
    set_usuario((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  //CAMBIAR FORMATO FECHA
  const obtenerFechaFormateada = (fechaString) => {
    const fecha = new Date(fechaString);
    fecha.setDate(fecha.getDate() + 1); // Ajustar la fecha sumando 1 día
    const year = fecha.getFullYear();
    const month = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const day = ('0' + fecha.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  // Función para dividir el texto en líneas de máximo 7 palabras
  const dividirTexto = (texto) => {
    const palabras = texto.split(' ');
    const lineas = [];
    let lineaActual = '';
    palabras.forEach((palabra, index) => {
      if ((index + 1) % 7 === 0) {
        lineas.push(lineaActual);
        lineaActual = '';
      }
      lineaActual += palabra + ' ';
    });
    if (lineaActual !== '') {
      lineas.push(lineaActual);
    }
    return lineas;
  };

  return (
    <div>
      <header>
        <BarraMenu />
      </header>
      <main>
        <div className="p-4 row">
          <div className="col-sm-10 mt-5 mb-4 ml-4 ">
            <h2 className='texto-subtitulo-1'>Listado de registros de usuarios en la plataforma</h2>
          </div>
        </div>
        <div className="container-tabla">
          <div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded" style={{ display: 'flex', flexDirection: 'column' }}>
            {isLoading && <div>Cargando...</div>}
            {!isLoading && data.length === 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <div>No hay peticiones disponibles</div>
              </div>
            )}
            {data.length > 0 &&
              <div className="col">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Fecha Nacimiento</th>
                        <th>Institución</th>
                        <th>Cargo</th>
                        <th>Dirección</th>
                        <th>Número de teléfono</th>
                        <th>Rol</th>
                        <th>Correo</th>
                        <th>Estado de la cuenta</th>
                        <th>Modificar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((estudiante) => (
                        <tr key={estudiante.id}>
                          <td>{estudiante.persona.nombres}</td>
                          <td>{estudiante.persona.apellidos}</td>
                          <td>{obtenerFechaFormateada(estudiante.persona.fecha_nacimiento)}</td>
                          <td>{estudiante.persona.institucion}</td>
                          <td>{estudiante.persona.cargo}</td>
                          <td>{estudiante.persona.direccion}</td>
                          <td>{estudiante.persona.telefono}</td>
                          <td>{estudiante.rol.tipo}</td>
                          <td>{estudiante.persona.cuenta.correo}</td>
                          <td>{estudiante.persona.cuenta.estado}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <Button variant="btn btn-floating m-1 btn-estado" onClick={() => {
                                handleShowChance();
                                obtenerIdCuenta(estudiante.persona.cuenta.external_id);
                              }}>
                                {estudiante.persona.cuenta.estado === "ESPERA" && <i className="fas fa-clock btn-espera"></i>}
                                {estudiante.persona.cuenta.estado === "ACEPTADO" && <i className="fas fa-check btn-aceptado"></i>}
                                {estudiante.persona.cuenta.estado === "RECHAZADO" && <i className="fas fa-times btn-rechazado"></i>}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            }

            {/* VENTANA MODAL CAMBIAR ESTADO */}
            <div className="model_box">
              <Modal
                show={showChance}
                onHide={handleCloseChance}
                keyboard={true}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Cambiar estado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <CambiarEstado usuario={usuario} handleChange={handleChange} />
                </Modal.Body>

                <Modal.Footer>
                  <Button variant="secondary" onClick={() => { handleCloseChance(); set_lista_usuarios(false); }}>
                    Cerrar
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>

  );
};

export default PeticionApi;
