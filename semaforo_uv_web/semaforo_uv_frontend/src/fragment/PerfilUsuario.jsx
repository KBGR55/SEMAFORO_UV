import React, { useState, useEffect } from 'react';
import '../css/style.css';
import Footer from './Footer';
import BarraMenu from './BarraMenu';
import { PeticionGet } from '../hooks/Conexion';
import { getToken, getCorreo, getUser, getRol } from '../utilidades/Sessionutil';
import logo from '../logo.png';
import mensajes from '../utilidades/Mensajes';

const PerfilUsuario = () => {
    const correoLogeado = getCorreo();
    const [userProfileData, setUserProfileData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await PeticionGet(getToken(), 'persona/listar');
                if (response.code === 200) {
                    const userProfiledatos = response.info.map((user) => ({
                        apellidos: user.apellidos,
                        nombres: user.nombres,
                        direccion: user.direccion,
                        fecha_nacimiento: user.fecha_nacimiento,
                        telefono: parseInt(user.telefono, 10),
                        cargo: user.cargo,
                        institucion: user.institucion,
                        correo: user.cuenta.correo,
                        tipo: getRol()
                    }));
                    setUserProfileData(userProfiledatos);
                } else {
                    mensajes(response.msg, 'error', 'error');
                }
            } catch (error) {
                console.error('Error al obtener el perfil de usuario:', error);
                mensajes('Error al obtener el perfil de usuario', 'error', 'error');
            }
        };
        fetchData();
    }, []);

    const formatearFecha = (fecha) => {
        const opcionesFecha = { day: 'numeric', month: 'numeric', year: 'numeric' };
        return new Date(fecha).toLocaleDateString(undefined, opcionesFecha);
    };

    return (
        <div>
            <header>
                <BarraMenu />
            </header>
            <div className="p-4 row">
                <div className="col-sm-10 mt-5 mb-4 ml-4 ">
                    <h2 className="texto-subtitulo-1">Perfil de Usuario</h2>
                </div>
            </div>
            <main className="container crud shadow-lg mb-4">
                <div className="row ">
                    <div className="col-md-4">
                        <img src={logo} alt="ico" style={{ width: '100%' }} />
                        <div className="text-center">
                            <strong className="texto-primario b texto-grande">{getRol()}</strong>
                        </div>
                    </div>
                    <div className="col-md-6 mb-4 mx-auto">
                        {userProfileData && (
                            <div className="card mt-4 ">
                                <div className="card-body">
                                    <div className="mt-3">
                                        {userProfileData
                                            .filter((user) => user.correo === correoLogeado)
                                            .map((user, index) => (
                                                <div key={index}>
                                                    <div className="row">
                                                        <div className="col-sm-5">
                                                            <strong className="texto-primario b texto-grande">Nombre:</strong>
                                                        </div>
                                                        <div className="col-sm-7">
                                                            <strong className="text-muted mb-0  texto-grande">{user.nombres} {user.apellidos}</strong>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div className="row">
                                                        <div className="col-sm-5">
                                                            <strong className="texto-primario b texto-grande">Dirección:</strong>
                                                        </div>
                                                        <div className="col-sm-7">
                                                            <strong className="text-muted mb-0  texto-grande ">{user.direccion}</strong>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div className="row">
                                                        <div className="col-sm-5">
                                                            <strong className="texto-primario b texto-grande">Fecha de Nacimiento:</strong>
                                                        </div>
                                                        <div className="col-sm-7">
                                                            <strong className="text-muted mb-0  texto-grande">{formatearFecha(user.fecha_nacimiento)}</strong>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div className="row">
                                                        <div className="col-sm-5">
                                                            <strong className="texto-primario b texto-grande">Teléfono:</strong>
                                                        </div>
                                                        <div className="col-sm-7">
                                                            <strong className="text-muted mb-0  texto-grande">{user.telefono}</strong>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div className="row">
                                                        <div className="col-sm-5">
                                                            <strong className="texto-primario b texto-grande">Cargo:</strong>
                                                        </div>
                                                        <div className="col-sm-7">
                                                            <strong className="text-muted mb-0  texto-grande">{user.cargo}</strong>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div className="row">
                                                        <div className="col-sm-5">
                                                            <strong className="texto-primario b texto-grande">Institución:</strong>
                                                        </div>
                                                        <div className="col-sm-7">
                                                            <strong className="text-muted mb-0  texto-grande">{user.institucion}</strong>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div className="row">
                                                        <div className="col-sm-5">
                                                            <strong className="texto-primario b texto-grande">Correo:</strong>
                                                        </div>
                                                        <div className="col-sm-7">
                                                            <strong className="text-muted mb-0  texto-grande">{user.correo}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PerfilUsuario;
