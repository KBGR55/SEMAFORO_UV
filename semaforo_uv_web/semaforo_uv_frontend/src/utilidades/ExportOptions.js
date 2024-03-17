import React from 'react';
import * as XLSX from 'xlsx';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ExportOptions({ chartRef, nombreFoto, data }) {
    const fechaActual = new Date();

    const exportChart = () => {
        const node = chartRef.current;
        toPng(node)
            .then(function (dataUrl) {
                const link = document.createElement('a');
                link.download = `${nombreFoto}_${fechaActual}.png`;
                link.href = dataUrl;
                link.click();
            });
    };

    const exportDataToExcel = () => {
        const wb = XLSX.utils.book_new();
        const wsData = [Object.values(data).map(column => ({ v: column.nombreColumna, s: { font: { bold: true }, fill: { fgColor: { rgb: "FFFF00" } } } }))];
    
        // Insertando el título en la primera fila
        wsData.unshift([`DATOS EXPORTADOS`]);
    
        wsData.splice(1, 0, []); // Insertar una fila vacía después del título

    
        // Iterate over the dates and create rows for each date
        for (let i = 0; i < Object.values(data)[0].datos.length; i++) {
            const row = [];
    
            // Iterate over each column and add the corresponding data to the row
            Object.values(data).forEach((column, index) => {
                row.push({ v: column.datos[i], s: { fill: { fgColor: { rgb: (i % 2 === 0) ? "EFEFEF" : "FFFFFF" } } } });
            });
    
            wsData.push(row);
        }
    
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Datos Generales');
        XLSX.writeFile(wb, `${nombreFoto}_${fechaActual}.xlsx`);
    };
    
    const exportDataToTxt = () => {
        const txtData = Object.values(data).reduce((acc, column) => {
            const columnData = column.datos.join('\t');
            return acc + `${column.nombreColumna}\t${columnData}\n`;
        }, '');

        const blob = new Blob([txtData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${nombreFoto}_${fechaActual}.txt`);
        link.click();
    };
    const exportDataToPdf = () => {
        const doc = new jsPDF();
        const titulo = `DATOS EXPORTADOS`;
        const tituloX = doc.internal.pageSize.getWidth() / 2;
        const margenSuperiorTitulo = 15;
        doc.text(titulo, tituloX, margenSuperiorTitulo, null, null, 'center');
        const margenSuperiorTabla = margenSuperiorTitulo + 10; // Ajusta según el espacio que quieras entre el título y la tabla

        const tableData = Object.values(data).reduce((acc, column) => {
            column.datos.forEach((dato, index) => {
                if (!acc[index]) {
                    acc[index] = [];
                }
                acc[index].push(dato);
            });
            return acc;
        }, []);

        const tableHeaders = Object.values(data).map(column => column.nombreColumna);

        doc.autoTable({
            head: [tableHeaders],
            body: tableData,
            startY: margenSuperiorTabla,
            styles: { overflow: 'linebreak' },
            columnStyles: { 0: { cellWidth: 'auto' } },
            margin: { top: 20 },
            didDrawCell: (data) => {
                const cell = data.cell;
                if (typeof cell.text === 'string') {
                    const fontSize = doc.internal.getFontSize();
                    const txtLength = doc.getStringUnitWidth(cell.text) * fontSize / doc.internal.scaleFactor;
                    const padding = 2 * doc.internal.scaleFactor;
                    const cellHeight = doc.getLineHeight() / doc.internal.scaleFactor;
                    const lines = cell.text.split(/\r\n|\r|\n/);
                    const lineHeight = (lines.length > 1) ? 1.2 : 1;

                    if (txtLength > cell.width - padding) {
                        const txt = cell.text.split('');
                        let tempTxt = '';

                        doc.setFontStyle(cell.styles.fontStyle);

                        for (let i = 0; i < txt.length; i++) {
                            tempTxt += txt[i];
                            if (doc.getStringUnitWidth(tempTxt) * fontSize / doc.internal.scaleFactor >= cell.width - padding) {
                                doc.text(cell.x + padding, cell.y + padding + (i * lineHeight * fontSize / doc.internal.scaleFactor), tempTxt);
                                tempTxt = '';
                            }
                        }

                        if (tempTxt !== '') {
                            doc.text(cell.x + padding, cell.y + padding + (lines.length * lineHeight * fontSize / doc.internal.scaleFactor), tempTxt);
                        }

                        return false;
                    }
                }

                return data;
            }
        });

        const tituloImagen = 'Gráfica';
        const tituloImagenX = 10;
        const tituloImagenY = doc.autoTable.previous.finalY + 20;
        doc.text(tituloImagen, tituloImagenX, tituloImagenY);
        
        toPng(chartRef.current)
            .then(function (dataUrl) {
                const imageHeightPercentage = 60; // Porcentaje de la altura del área del PDF
                const imageYPercentage = 2; // Porcentaje de la posición Y del área del PDF
        
                const pageHeight = doc.internal.pageSize.getHeight();
        
                const imageHeight = pageHeight * (imageHeightPercentage / 100);
                const imageY = pageHeight * (imageYPercentage / 100);
        
                // Se establece un ancho arbitrario, por ejemplo, 100.
                doc.addImage(dataUrl, 'PNG', 10, imageY + tituloImagenY + 10, 100, imageHeight);
                doc.save(`${nombreFoto}_${fechaActual}.pdf`);
            });
              
        
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <button style={{ flex: 1, margin: '5px', display: 'flex', alignItems: 'center' }} className="boton btn" onClick={exportChart}>
                <i className="fas fa-image" style={{ marginRight: '5px' }}></i>
                Exportar Gráfico a PNG
            </button>
            <button style={{ flex: 1, margin: '5px', display: 'flex', alignItems: 'center' }} className="boton btn" onClick={exportDataToExcel}>
                <i className="fas fa-file-excel" style={{ marginRight: '5px' }}></i>
                Exportar Datos a Excel
            </button>
            <button style={{ flex: 1, margin: '5px', display: 'flex', alignItems: 'center' }} className="boton btn" onClick={exportDataToTxt}>
                <i className="fas fa-file-alt" style={{ marginRight: '5px' }}></i>
                Exportar Datos a TXT
            </button>
            <button style={{ flex: 1, margin: '5px', display: 'flex', alignItems: 'center' }} className="boton btn" onClick={exportDataToPdf}>
                <i className="fas fa-file-pdf" style={{ marginRight: '5px' }}></i>
                Exportar Datos a PDF
            </button>
        </div>

    );
}
