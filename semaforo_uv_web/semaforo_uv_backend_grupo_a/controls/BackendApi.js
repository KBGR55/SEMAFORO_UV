const SesionToken = require('./token');
const fetch = require('node-fetch');
const URL_SERVER = "https://computacion.unl.edu.ec/uv/api/";
const TOKEN_SERVER = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2wiOiJCQUNLRU5EIiwiaWF0IjoxNzA4Mjk3Mjc5fQ.JB-WBZrytjrc_i_WqsQXG3yGmR2-2nTHM8Hk8TVanXM";
class BackendApi {

    generar_token = async () => {
        try {
            const URL_TOKEN = URL_SERVER + "tokenBackend";
            const response = await fetch(URL_TOKEN);
            if (!response.ok) {
                throw new Error(`Error al obtener el token: ${response.statusText}`);
            }
            const data = await response.json();
            console.log(data.token + "YYYYYYYYYYYYYYYYYYYY");
            SesionToken.settokenApi(data.token);
        } catch (error) {
            console.error("Ocurrió un error al obtener el token:", error);
            throw error;
        }
    }

    async obtener_medicion_promedio(req, res) {
        const obtenerDatos = async () => {
            const headers = {
                "Content-Type": "application/json"
            };
            const response = await fetch(`${URL_SERVER}/medicionDispositivos`, {
                method: "GET",
                headers: headers,
            });
            const datos = await response.json();
            return datos;
        }

        try {
            const datos = await obtenerDatos();
            const medicionesDelDia = datos.ultimasMediciones.filter(medicion => {
                try {
                    const fechaMedicion = new Date(medicion.medicions[0].fecha).toISOString().split('T')[0];
                    const currentDateUTC = new Date();
                    const offset = currentDateUTC.getTimezoneOffset(); // Obtener el desfase de la zona horaria en minutos
                    const fechaActual = new Date(currentDateUTC.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];; // Convertir a hora local
                    return fechaMedicion === fechaActual;
                } catch (error) {
                    console.error('Error al convertir fecha:', error);
                    return false;
                }
            });
            const totalUV = medicionesDelDia.reduce((sum, medicion) => sum + medicion.medicions[0].uv, 0);
            const promedio = totalUV / medicionesDelDia.length;
            res.json({ msg: 'OK!', code: 200, info: { promedioUV: promedio } });
        } catch (error) {
            console.error('Error fetching medicion promedio:', error);
            res.status(500).json({ msg: 'Error fetching medicion promedio', code: 500 });
        }
    }

    async obtener_activos(req, res) {
        const obtenerDatosActivos = async () => {
            const headers = {
                "Content-Type": "application/json"
            };
            const response = await fetch(`${URL_SERVER}/activos`, {
                method: "GET",
                headers: headers,
            });
            const datos = await response.json();
            return datos;
        }
        try {
            const activos = await obtenerDatosActivos();
            res.json({ msg: 'OK!', code: 200, info: activos.dispositivos });
        } catch (error) {
            console.error('Error fetching activos:', error);
            res.status(500).json({ msg: 'Error fetching activos', code: 500 });
        }
    }
    async obtener_dispositivo(req, res) {
        const obtener = async () => {
            const headers = {
                "Content-Type": "application/json"
            };
            const response = await fetch(`${URL_SERVER}/medicionDispositivos`, {
                method: "GET",
                headers: headers,
            });
            const datos = await response.json();
            return datos;
        }
        try {
            const activos = await obtener();

            // Obtener el nombre del dispositivo por id
            const dispositivosConNombres = activos.ultimasMediciones.map(dispositivo => {
                return {
                    id: dispositivo.id,
                    nombre: dispositivo.nombre
                };
            });

            res.json({ msg: 'OK!', code: 200, info: dispositivosConNombres });
        } catch (error) {
            console.error('Error fetching activos:', error);
            res.status(500).json({ msg: 'Error fetching activos', code: 500 });
        }
    }

    async obtener_medicion_promedio_dia(req, res) {
        const obtenerDispositivo = async () => {
            const headers = {
                "Content-Type": "application/json"
            };
            const response = await fetch(`${URL_SERVER}/medicionDispositivos`, {
                method: "GET",
                headers: headers,
            });
            const datos = await response.json();
            return datos;
        }
        const obtenerDatos = async (fechaInicio, fechaFin) => {
            const headers = {
                "Content-Type": "application/json",
                'x-api-token': TOKEN_SERVER
            };
            const data = {
                fechaInicio: fechaInicio,
                fechaFin: fechaFin
            };
            const response = await fetch(`${URL_SERVER}/medicionFechas`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data),
            });
            const datos = await response.json();
            return datos;
        }
        try {
            const currentDateUTC = new Date();
            const offset = currentDateUTC.getTimezoneOffset();
            const fechaActual = new Date(currentDateUTC.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
            const fechaFin = new Date(fechaActual);
            fechaFin.setDate(fechaFin.getDate() + 1);
            const activos = await obtenerDispositivo();
            const dispositivosConNombres = activos.ultimasMediciones.map(dispositivo => {
                return {
                    id: dispositivo.id,
                    nombre: dispositivo.nombre
                };
            });
            const datos = await obtenerDatos(fechaActual, fechaFin.toISOString().split('T')[0]);
            const fechas = datos.mediciones.map(medicion => {
                const fechaISO = new Date(medicion.fecha).toISOString();
                const fechaConHoras = `${fechaISO.slice(0, 10)} ${fechaISO.slice(11, 19)}`;                 return fechaConHoras;
            });


            const radiacionUV = datos.mediciones.map(medicion => medicion.uv);
            const dispositivos = datos.mediciones.map(medicion => medicion.dispositivoId);
            const dispositivosNombres = datos.mediciones.map(medicion =>
                dispositivosConNombres.find(dispositivos => dispositivos.id === medicion.dispositivoId)?.nombre || `Dispositivo ${medicion.dispositivoId}`);
            const data = {
                listacolumna1: { nombreColumna: "Fechas", datos: fechas },
                listacolumna2: { nombreColumna: "Radiacion UV", datos: radiacionUV },
                listadispositivos: { nombreColumna:"ÁREA DE UBICACIÓN", datos: dispositivosNombres }
            };
            const dataPorDispositivos = {};
            dispositivos.forEach((dispositivo, index) => {
                const nombreDispositivo = dispositivosConNombres.find(dispositivos => dispositivos.id === dispositivo)?.nombre || `Dispositivo ${dispositivo}`;
                if (!dataPorDispositivos[`dataDispositivo${dispositivo}`]) {
                    dataPorDispositivos[`dataDispositivo${dispositivo}`] = {
                        nombre: nombreDispositivo,
                        listacolumna1: { nombreColumna: "Fechas", datos: [] },
                        listacolumna2: { nombreColumna: "Radiacion UV", datos: [] }
                    };
                }
                dataPorDispositivos[`dataDispositivo${dispositivo}`].listacolumna1.datos.push(fechas[index]);
                dataPorDispositivos[`dataDispositivo${dispositivo}`].listacolumna2.datos.push(radiacionUV[index]);
            });
            res.json({ msg: 'OK!', code: 200, info: { data: data, dataPorDispositivos: dataPorDispositivos } });
        } catch (error) {
            console.error('Error fetching medicion promedio:', error);
            res.status(500).json({ msg: 'Error fetching medicion promedio', code: 500 });
        }

    }
    async obtener_medicion_dispositivos(req, res) {
        const obtenerDatos = async () => {
            const headers = {
                "Content-Type": "application/json"
            };
            const response = await fetch(`${URL_SERVER}/medicionDispositivos`, {
                method: "GET",
                headers: headers,
            });
            const datos = await response.json();
            return datos;
        }
        try {
            const datos = await obtenerDatos();
            const medicionesDelDia = datos.ultimasMediciones.filter(medicion => {
                try {
                    const fechaMedicion = new Date(medicion.medicions[0].fecha).toISOString().split('T')[0];
                    const currentDateUTC = new Date();
                    const offset = currentDateUTC.getTimezoneOffset(); // Obtener el desfase de la zona horaria en minutos
                    const fechaActual = new Date(currentDateUTC.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];; // Convertir a hora local
                    return fechaMedicion === fechaActual;
                } catch (error) {
                    console.error('Error al convertir fecha:', error);
                    return false;
                }
            });
            const lista = medicionesDelDia;
            res.json({ msg: 'OK!', code: 200, info: { lista: lista} });
        } catch (error) {
            console.error('Error fetching medicion promedio:', error);
            res.status(500).json({ msg: 'Error fetching medicion promedio', code: 500 });
        }
    }
}

module.exports = BackendApi;
