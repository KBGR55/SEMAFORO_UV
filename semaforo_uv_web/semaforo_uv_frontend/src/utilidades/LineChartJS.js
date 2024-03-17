import { Line } from 'react-chartjs-2';
import React, { useRef } from 'react';
import ExportOptions from './ExportOptions';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { getToken } from './Sessionutil';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function LineChartJS({ data, dispositivos, nombreFoto }) {
    const chartRef = useRef(null);
    const token = getToken();
    // Función para generar los datos y opciones para cada dispositivo
    const generarDatosYOptions = (dataDispositivo) => {
        const midata = {
            labels: dataDispositivo.listacolumna1.datos,
            datasets: [
                {
                    label: dataDispositivo.listacolumna2.nombreColumna,
                    data: dataDispositivo.listacolumna2.datos,
                    tension: 0.5,
                    fill: true,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    pointRadius: 5,
                    pointBorderColor: 'rgba(255, 99, 132)',
                    pointBackgroundColor: 'rgba(255, 99, 132)',
                }
            ],
        };

        const misoptions = {
            scales: {
                y: {
                    min: 0
                },
                x: {
                    ticks: { color: 'rgb(255, 99, 132)' }
                }
            }
        };

        return { midata, misoptions };
    };

    return (
        <div className="flex-fill w-100">
             {token && <div className="shadow-lg w-100 p-2 mb-2">
              <ExportOptions chartRef={chartRef} nombreFoto={nombreFoto} data={data.data} />
            
                </div>}
            <div className="shadow-lg flex-fill w-100 mb-2" ref={chartRef}>
            <h5 className="texto-primario-h3 mb-0">RADIACIÓN DEL DÍA</h5>
                {data.dataPorDispositivos && Object.values(data.dataPorDispositivos).map((dataDispositivo, index) => {
                    const { midata, misoptions } = generarDatosYOptions(dataDispositivo);
                    return (
                        <div className="w-100 mb-2">
                            <h5 className="texto-primario-h3 mb-0">{dataDispositivo.nombre.toUpperCase()}</h5>
                            <div className="card-body d-flex w-100 p-4">
                                <Line data={midata} options={misoptions} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
