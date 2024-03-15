import * as React from 'react';
import PieChart from 'react-native-pie-chart';
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { useState } from 'react';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { PeticionGet } from '../hooks/Conexion';
import moment from 'moment-timezone';
import { Table, Row, Rows, Col } from 'react-native-table-component';

const SettingsScreens = () => {
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
  useEffect(() => {
    obtenerMediciones();
  }, []);
  const widthAndHeight = 50
  const uvRanges = [
    { min: 0, max: 2, color: "#2ecc71" },
    { min: 3, max: 5, color: "#f1c40f" },
    { min: 6, max: 7, color: "#eb7343" },
    { min: 8, max: 10, color: "#c0392b" },
    { min: 11, max: Infinity, color: "#8128b4" }
  ];

  const getUVRangeIndex = (uv) => {
    for (let i = 0; i < uvRanges.length; i++) {
      if (uv >= uvRanges[i].min && uv <= uvRanges[i].max) {
        return i;
      }
    }
    return -1;
  };

  const formatearFechaHora = (fechaOriginal) => {
    const fechaISO = new Date(fechaOriginal).toISOString();
    const fechaConHoras = `${fechaISO.slice(0, 10)} ${fechaISO.slice(11, 19)}`;
    return fechaConHoras;
  }
  const tableHead = ['CLASIFICACIÓN', 'RANGO', 'COLOR'];
  const tableData = [
    ['BAJO', '0 - 2', 'VERDE'],
    ['MODERADO', '3 - 5', 'AMARILLO'],
    ['ALTO', '6 - 7', 'NARANJA'],
    ['MUY ALTO', '8 - 10', 'ROJO'],
    ['EXTREMO', '11 - 15', 'MORADO'],
  ];
  return (
    <LinearGradient colors={["#1d2b44", "#1e2d48", "#0d4f81"]} style={styles.container}>
      <ScrollView >
        <View style={styles.infoDetails}>
          <Text style={styles.infoDetailsText}>Áreas específicas</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {medicionDispositivos.map((area, index) => (
              <View key={index} style={styles.infoDetailsCardConten}>
                <View key={index} style={styles.infoDetailsCard}>
                  <Text style={styles.infoDetailsCardWeekDay}>{area.nombre}</Text>
                  <PieChart
                    widthAndHeight={widthAndHeight}
                    series={[1]}
                    sliceColor={[uvRanges[getUVRangeIndex(area.medicions[0].uv.toFixed(0))].color]}
                    coverRadius={0.45}
                  />
                  <Text style={styles.infoDetailsCardWeekDay}>{area.medicions[0].uv}</Text>
                </View>
                <Text style={styles.infoDetailsCardPreview}>Ultima medición:</Text>
                <Text style={styles.infoDetailsCardPreview}>{formatearFechaHora(area.medicions[0].fecha)}</Text>
              </View>
            ))}
          </ScrollView>
          <Text style={styles.infoDetailsText}>Indicadores UV</Text>
          <View style={styles.infoDetailsCard2}>
            <Table style={styles.table}>
              <Row
                data={tableHead}
                style={styles.head}
                textStyle={styles.headerText}
              />
              <Rows data={tableData} textStyle={styles.cell} />
            </Table>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',

  },
  infoDetails: {
    marginTop: 20,
    paddingLeft: 20,
  },
  infoDetailsText: {
    color: "#FFF",
    marginTop: 35,
    fontSize: 22,
    fontWeight: "600",
  },
  infoDetailsCard: {
    padding: 20,
    width: 170,
    height: 250,
    backgroundColor: "rgba(255, 255, 255, 0.23)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  infoDetailsCard2: {
    marginTop: 10,
    backgroundColor: '#fff',
    width: 350,
  },
  infoDetailsCardConten: {
    marginRight: 20,
    marginTop: 20,
  },
  infoDetailsCardWeekDay: {
    fontSize: 15,
    color: "#FFF",
    textAlign: 'center',
    fontWeight: "450",
    marginBottom: 8,
  },
  infoDetailsCardPreview: {
    fontSize: 10,
    textAlign: 'center',
    color: "#FFF",
    fontWeight: "700",
  },
  head: { height: 40, backgroundColor: '#0c2342' },
  headerText: { fontSize: 10, fontWeight: 'bold', textAlign: 'center', color: '#fff' },
  cell: { textAlign: 'center', fontSize: 10 },
});


export default SettingsScreens;