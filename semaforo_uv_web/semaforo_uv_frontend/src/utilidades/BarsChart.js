import React, { useRef } from 'react';
import ExportOptions from './ExportOptions';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import {getToken } from './Sessionutil';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const BarsChart = ({ data, nombreFoto ,cantidad_comentarios, clasificacion }) => {
    const chartRef = useRef(null);
    const token = getToken();

    const midata = {
        labels: clasificacion , // Usando datos de la primera columna para las etiquetas
        datasets: [
            {
                label:"CLASIFICACIÓN", // Usando el nombre de la segunda columna como etiqueta
                data: cantidad_comentarios,
                backgroundColor: ['rgba(0, 220, 195, 0.5)', 'rgba(255, 99, 132, 0.5)'] // Agrega los colores aquí
            }
        ]
    };

    const misoptions = {
        responsive: true,
        animation: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                min: 0,
                max: Math.max(...cantidad_comentarios) + 5
            },
            x: {
                ticks: { color: ['rgba(0, 220, 195)', 'rgba(255, 99, 132)'] } // Colores para los ticks
            }
        }
    };
    return (
        <div className="flex-fill w-100">
            <div className="shadow-lg p-2 mb-2">
            {token && <ExportOptions chartRef={chartRef} nombreFoto={nombreFoto} data={data} />
              }
                </div>
          
            <div className="shadow-lg  w-100 mb-2" ref={chartRef}>
                    <h3 className="texto-primario-h3 mb-0">CLASIFICACIÓN DE LOS COMENTARIOS</h3>
                <div className="card-body  w-100 p-4">
                    <Bar data={midata} options={misoptions} />
                </div>
            </div>
        </div>
    );
};

export default BarsChart;