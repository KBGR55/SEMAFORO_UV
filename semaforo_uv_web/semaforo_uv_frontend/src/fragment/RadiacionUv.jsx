import React, { useEffect, useState, useRef } from 'react';
import '../css/style.css';
import '../css/style_semaforo.css';
import Footer from './Footer';
import BarraMenu from './BarraMenu';
import DonutChart from './DonutChart';
import mapboxgl from 'mapbox-gl';
import LineChartJS from '../utilidades/LineChartJS';
import { getToken } from '../utilidades/Sessionutil';
import { PeticionGet, PeticionPost } from '../hooks/Conexion';
import mensajes from '../utilidades/Mensajes';

const getMessageForColor = (color) => {
    switch (color) {
        case 'green':
            return 'Puede disfrutar del sol con precaución.';
        case 'yellow':
            return 'Aplique protector solar y use sombrero.';
        case 'orange':
            return 'Evite el sol entre las 10 a.m. y las 4 p.m.';
        case 'red':
            return 'Busque sombra y use protector solar.';
        case 'purple':
            return 'Evite la exposición al sol en horas de máxima radiación.';
        default:
            return '';
    }
};
const getColorForLevel = (nivel) => {
    if (nivel >= 0 && nivel <= 2) {
        return 'green'; // Bajo
    } else if (nivel > 2 && nivel <= 5) {
        return 'yellow'; // Moderado
    } else if (nivel > 5 && nivel <= 7) {
        return 'orange'; // Alto
    } else if (nivel > 7 && nivel <= 10) {
        return 'red'; // Muy alto
    } else if (nivel > 10 && nivel <= 15) {
        return 'purple'; // Extremo
    } else {
        return 'blue';
    }
};
const UVSemaforo = ({ nivel }) => {
    const $lucesDelCirculo = useRef([]);
    const mensajeVerde = getMessageForColor('green');
    const mensajeAmarillo = getMessageForColor('yellow');
    const mensajeNaranja = getMessageForColor('orange');
    const mensajeRojo = getMessageForColor('red');
    const mensajeMorado = getMessageForColor('purple');

    useEffect(() => {
        $lucesDelCirculo.current.forEach((luz, index) => {
            luz.classList.remove('green', 'yellow', 'orange', 'red', 'purple'); // Elimina los colores anteriores
            luz.classList.add(getColorForIndex(index, nivel)); // Agrega el color correspondiente al nivel y la posición
        });
    }, [nivel]);

    const getColorForIndex = (index, nivel) => {
        const nivelColor = getColorForLevel(nivel);
        const colors = ['purple', 'red', 'orange', 'yellow', 'green']; // Orden de colores

        if (index === colors.indexOf(nivelColor)) {
            return nivelColor; // Asigna el color correspondiente a la posición adecuada
        } else {
            return 'luces-circulo'; // Conserva la clase base para otras posiciones
        }
    };
    return (
        <div className="row mb-4">
            <div className="col-sm-12 col-md-2">
                <div className="semaforo  mx-auto">
                    <span ref={(el) => $lucesDelCirculo.current[0] = el} className="luces-circulo"></span>
                    <span ref={(el) => $lucesDelCirculo.current[1] = el} className="luces-circulo"></span>
                    <span ref={(el) => $lucesDelCirculo.current[2] = el} className="luces-circulo"></span>
                    <span ref={(el) => $lucesDelCirculo.current[3] = el} className="luces-circulo"></span>
                    <span ref={(el) => $lucesDelCirculo.current[4] = el} className="luces-circulo"></span>
                </div>
            </div>
            <div className="col-sm-12 col-md mt-2 ml-6">
                <div className="alert alert-morado" role="alert">
                    <i className="fas fa-sun"></i> {mensajeMorado}
                </div>
                <div className="alert alert-rojo" role="alert">
                    <i className="fas fa-exclamation-circle"></i> {mensajeRojo}
                </div>
                <div className="alert  alert-naranja" role="alert">
                    <i className="fas fa-exclamation-triangle"></i> {mensajeNaranja}
                </div>
                <div className="alert alert-amarillo" role="alert">
                    <i className="fas fa-sun"></i> {mensajeAmarillo}
                </div>
                <div className="alert alert-verde" role="alert">
                    <i className="fas fa-check-circle"></i>{mensajeVerde}
                </div>
            </div>
        </div>
    );
};

const MapComponent = () => {
    const [map, setMap] = useState(null);
    const [ubicacionesCombinadas, setUbicacionesCombinadas] = useState([]);
    const [nivelUv, setNivelUV] = useState();
    const [dataGraficaDiaActual, setDataGraficaDiaActual] = useState([]);
    const [medicionDispositivos, setMedicionDispositivos] = useState([]);
    const obtenerMediciones = async () => {
        try {
            const response = await PeticionGet("", 'server/medicion_dispositivos_dia');
            if (response.code === 200) {
                const nivelUvRedondeado = response.info.lista;
                setMedicionDispositivos(nivelUvRedondeado);
            } else {
            }
        } catch (error) {
            console.error('Error al obtener nivel:', error);
        }
    };


    const obtenerDatosGraficaDiaActual = async () => {
        try {
            const response = await PeticionPost(getToken(), 'server/medicion_promedio_dia', []);
            if (response.code === 200) {
                setDataGraficaDiaActual(response.info);
                console.log("oiuyft", response.info);
            } else {
                mensajes(response.msg, "error", "error");
            }
        } catch (error) {
            console.error('Error al obtener mediciones del dia:', error);
            mensajes('Error al obtener las mediciones del dia', "error", "error");
        }
    };

    useEffect(() => {
        const obtenerUbicaciones = async () => {
            try {
                const response = await PeticionGet(getToken(), 'server/dispositivos_activos');
                if (response.code === 200) {
                    const ubicaciones = response.info.map(({ nombre, latitud, longitud }) => ({
                        lat: latitud,
                        lon: longitud,
                        label: nombre
                    }));
                    setUbicacionesCombinadas(ubicaciones);
                } else {
                    mensajes(response.msg, "error", "error");
                }
            } catch (error) {
                console.error('Error al obtener ubicaciones:', error);
                mensajes('Error al obtener ubicaciones', "error", "error");
            }
        };
        obtenerUbicaciones();
        const obtenerNivel = async () => {
            try {
                const response = await PeticionGet(getToken(), 'server/medicion_promedio');
                if (response.code === 200) {
                    const nivelUvRedondeado = response.info.promedioUV.toFixed(4);
                    setNivelUV(nivelUvRedondeado);
                } else {
                    mensajes(response.msg, "error", "error");
                }
            } catch (error) {
                console.error('Error al obtener nivel:', error);
                mensajes('Error al obtener nivel', "error", "error");
            }
        };
        obtenerNivel();
        obtenerDatosGraficaDiaActual();
        obtenerMediciones();
    }, []);

    useEffect(() => {
        if (map && ubicacionesCombinadas.length > 0) {
            ubicacionesCombinadas.forEach((punto) => {
                const popup = new mapboxgl.Popup().setHTML(`
                    <div>
                        <h4>${punto.label}</h4>     
                    </div>
                `);
                new mapboxgl.Marker()
                    .setLngLat([punto.lon, punto.lat])
                    .setPopup(popup)
                    .addTo(map);
            });
        }
    }, [map, ubicacionesCombinadas]);

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1Ijoia2FyZW41NTUiLCJhIjoiY2xxeThrODJ6MGt3dDJqcGduazVnenFyYiJ9.mp7AsHPGexTU9t6GuVmV4g';
        const mapInstance = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-79.19919575060402, -4.031567642913307],
            zoom: 14,
        });
        setMap(mapInstance);
        return () => mapInstance.remove();
    }, []);

    const handleZoomIn = () => {
        if (map) {
            map.zoomIn();
        }
    };

    const handleZoomOut = () => {
        if (map) {
            map.zoomOut();
        }
    };
    const formatearFechaHora = (fechaOriginal) => {
        const fechaISO = new Date(fechaOriginal).toISOString();
        const fechaConHoras = `${fechaISO.slice(0, 10)} ${fechaISO.slice(11, 19)}`;
        return fechaConHoras;
    }

    return (
        <div >
            <header>
                <BarraMenu />
            </header>
            <section className="text-center container-mapa">
                <div className="zoom-buttons">
                    <button onClick={handleZoomIn} className='btn-mapa'>
                        <i className="fas fa-search-plus"></i>
                    </button>
                    <button onClick={handleZoomOut} className='btn-mapa'>
                        <i className="fas fa-search-minus"></i>
                    </button>
                </div>
                <div id="map" style={{ height: '450px' }} className="w-100"></div>
            </section>
            <main>
                <div className='container-fluid'>
                    <div className='row justify-content-center mt-4 mb-4 p-3'>
                        <div className="col-xxl-11 d-flex">
                            <div className="shadow-lg row justify-content-center align-items-center">
                                {medicionDispositivos.map((area, index) => (
                                    <div className="col-xl-3 col-md-6 mb-4 p-2" key={index}>
                                        <div className="card shadow-lg border-left-primary shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <h4 className="texto-primario-h4 mb-2">{area.nombre.toUpperCase()}</h4>
                                                        <p>Ultima medición: {formatearFechaHora(area.medicions[0].fecha)}</p>
                                                    </div>
                                                </div>

                                                <div className="progress mb-2" role="progressbar" aria-valuenow={(area.medicions[0].uv / 15) * 100} aria-valuemin="0" aria-valuemax="15">
                                                    <div className="progress-bar" style={{ width: `${(area.medicions[0].uv / 15) * 100}%` }}></div>
                                                </div>
                                                <p className='text-center'>Radiación ultravioleta: {area.medicions[0].uv.toFixed(4)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='row justify-content-center mt-4 mb-4'>
                        <div className="col-12 col-lg-8 col-xxl-7 d-flex">
                            <LineChartJS data={dataGraficaDiaActual} nombreFoto="radiacion_uv" />
                        </div>
                        <div className='col-12 col-lg-4 col-xxl-4 d-flex'>
                            <div className="shadow-lg p-4 flex-fill w-100">
                                <div className="card-header">
                                    <h3 className="texto-primario-h3 mb-2">RECOMENDACIONES</h3>
                                </div>
                                <div className="mx-auto w-100">
                                    <UVSemaforo nivel={nivelUv}></UVSemaforo>
                                    <div className="mb-2">
                                        <h3 className="texto-primario-h3">INDICADORES UV</h3>
                                        <div className="crud shadow-lg p-3 mb-5 bg-body rounded" style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div className="col">
                                                <div className="table-responsive">
                                                    <table className="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th >CLASIFICACIÓN</th>
                                                                <th >RANGO</th>
                                                                <th >COLOR</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>BAJO</td>
                                                                <td className='text-center'>0 - 2</td>
                                                                <td className='text-center'>VERDE</td>
                                                            </tr>
                                                            <tr>
                                                                <td>MODERADO</td>
                                                                <td className='text-center'>3 - 5</td>
                                                                <td className='text-center'>AMARILLO</td>
                                                            </tr>
                                                            <tr>
                                                                <td>ALTO</td>
                                                                <td className='text-center'>6 - 7</td>
                                                                <td className='text-center'>NARANJA</td>
                                                            </tr>
                                                            <tr>
                                                                <td>MUY ALTO</td>
                                                                <td className='text-center'>8 - 10</td>
                                                                <td className='text-center'>ROJO</td>
                                                            </tr>
                                                            <tr>
                                                                <td>EXTREMO</td>
                                                                <td className='text-center'>11 - 15</td>
                                                                <td className='text-center'>MORADO</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                    <DonutChart uv={nivelUv} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>


    );
};

export default MapComponent;