import * as React from 'react';
import PieChart from 'react-native-pie-chart';
import { BellSimple, CaretDown, MapPin } from "phosphor-react-native";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import Svg, { Path } from 'react-native-svg';
import { useState } from 'react';
import { useEffect } from 'react';
import { PeticionGet } from '../hooks/Conexion';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    margin: 10,
  },
  content: { paddingHorizontal: 40 },
  header: {
    width: "100%",
    marginTop: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 10, // Use marginLeft instead of gap
  },
  headerLeftText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  info: {
    paddingVertical: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  infoImg: {
    width: 230,
    height: 230,
  },
  infoText: {
    marginTop: 65,
    fontSize: 50,
    fontWeight: "300",
    color: "#0c2342",

  },
  infoTextMaxMin: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  infoDetails: {
    marginTop: 65,
    paddingLeft: 20,
  },
  infoDetailsText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "300",
  },
  infoDetailsCard: {
    marginRight: 20,
    width: 99,
    height: 129,
    backgroundColor: "rgba(255, 255, 255, 0.23)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4, // Use marginHorizontal instead of gap
  },
  infoDetailsCardWeekDay: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoDetailsCardPreview: {
    fontSize: 24,
    fontWeight: "300",
  }
});

export default function DonutChart() {
  const [uv, setUv] = useState(1.0);
  const obtenerNivel = async () => {
    try {
      const response = await PeticionGet("", 'server/medicion_promedio');
      if (response.code === 200) {
        const nivelUvRedondeado = response.info.promedioUV.toFixed(2);
        setUv(nivelUvRedondeado);
      } else {
      }
    } catch (error) {
      console.error('Error al obtener nivel:', error);
    }
  };
  useEffect(() => {
    obtenerNivel();
  }, []);
  let data;

  if (uv <= 2) {
    data = [
      { color: '#299501', value: 20 },
      { color: '#F8EEB0', value: 20 },
      { color: '#F7BFB2', value: 20 },
      { color: '#D7AEB8', value: 20 },
      { color: '#D882EE', value: 20 }
    ];
  } else if (uv <= 5) {
    data = [
      { color: '#ADE1CA', value: 20 },
      { color: '#F8E600', value: 20 },
      { color: '#F7BFB2', value: 20 },
      { color: '#D7AEB8', value: 20 },
      { color: '#D882EE', value: 20 }
    ];
  } else if (uv <= 7) {
    data = [
      { color: '#ADE1CA', value: 20 },
      { color: '#F8EEB0', value: 20 },
      { color: '#F85A00', value: 20 },
      { color: '#D7AEB8', value: 20 },
      { color: '#D882EE', value: 20 }
    ];
  } else if (uv <= 10) {
    data = [
      { color: '#ADE1CA', value: 20 },
      { color: '#F8EEB0', value: 20 },
      { color: '#F7BFB2', value: 20 },
      { color: '#D7001F', value: 20 },
      { color: '#D882EE', value: 20 }
    ];
  } else {
    data = [
      { color: '#ADE1CA', value: 20 },
      { color: '#F8EEB0', value: 20 },
      { color: '#F7BFB2', value: 20 },
      { color: '#D7AEB8', value: 20 },
      { color: '#6A4AC7', value: 20 }
    ];
  }


  // Radio del círculo interior (espacio en el medio)
  const innerRadius = 80;

  // Función para generar los segmentos de pastel
  const generatePieSegments = () => {
    let cumulativeValue = 0;
    return data.map((segment, index) => {
      const { color, value } = segment;
      const startAngle = ((cumulativeValue / 100) * 180) - 90;
      cumulativeValue += value;
      const endAngle = ((cumulativeValue / 100) * 180) - 90;
      const pathData = describeArc(100, 100, 100, innerRadius, startAngle, endAngle);
      return <Path key={index} d={pathData} fill={color} />;
    });
  };

  // Función para generar la descripción del arco
  const describeArc = (x, y, outerRadius, innerRadius, startAngle, endAngle) => {
    const startOuterRadians = (startAngle - 90) * Math.PI / 180;
    const endOuterRadians = (endAngle - 90) * Math.PI / 180;
    const startInnerRadians = (startAngle - 90) * Math.PI / 180;
    const endInnerRadians = (endAngle - 90) * Math.PI / 180;

    const outerStartX = x + outerRadius * Math.cos(startOuterRadians);
    const outerStartY = y + outerRadius * Math.sin(startOuterRadians);
    const outerEndX = x + outerRadius * Math.cos(endOuterRadians);
    const outerEndY = y + outerRadius * Math.sin(endOuterRadians);

    const innerStartX = x + innerRadius * Math.cos(startInnerRadians);
    const innerStartY = y + innerRadius * Math.sin(startInnerRadians);
    const innerEndX = x + innerRadius * Math.cos(endInnerRadians);
    const innerEndY = y + innerRadius * Math.sin(endInnerRadians);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const pathData = [
      `M ${outerStartX} ${outerStartY}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
      `L ${innerEndX} ${innerEndY}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
      `Z`
    ].join(' ');
    return pathData;
  };

  const conseguirColor = (id) => {
    switch (id) {
      case 1:
        if (uv > 10) {
          return '#6A4AC7';
        } else {
          return '#D882EE';
        }
        break;
      case 2:
        if (10 >= uv && uv > 7) {
          return '#D7001F';
        } else {
          return '#D7AEB8';
        }
        break;
      case 3:
        if (7 >= uv && uv > 5) {
          return '#F85A00';
        } else {
          return '#F7BFB2';
        }
        break;
      case 4:
        if (5 >= uv && uv > 2) {
          return '#F8E600';
        } else {
          return '#F8EEB0';
        }
        break;
      case 5:
        if (2 >= uv) {
          return '#299501';
        } else {
          return '#ADE1CA';
        }
        break;
      default:
        break;
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}>
      <Svg height="40%" width="90%" viewBox="0 0 200 140">
        {generatePieSegments()}
      </Svg>

      <Text style={{ position: 'absolute', top: "20%", fontSize: 40, fontWeight: '900', color: '#0c2342' }}>{uv}</Text>
      <Text style={{ position: 'absolute', top: "30%", fontSize: 25, fontWeight: '900', color: "#0d4f81" }}>Min: 0 - Max: 15</Text>
      <View style={{ backgroundColor: '#E9EDF1', width: "90%", height: "50%", borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ backgroundColor: conseguirColor(1), width: "95%", height: "18%", borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 12, fontWeight: '500' }}>Evite la exposición al sol en horas de máxima radiación.</Text>
        </View>
        <View style={{ backgroundColor: conseguirColor(2), width: "95%", height: "18%", borderRadius: 10, marginTop: "2%", alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 12, fontWeight: '500' }}>Busque la sombra y use protector solar.</Text>
        </View>
        <View style={{ backgroundColor: conseguirColor(3), width: "95%", height: "18%", borderRadius: 10, marginTop: "2%", alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 12, fontWeight: '500' }}>Evite el sol entre 10 a.m y 4 p.m.</Text>
        </View>
        <View style={{ backgroundColor: conseguirColor(4), width: "95%", height: "18%", borderRadius: 10, marginTop: "2%", alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 12, fontWeight: '500' }}>Aplique protector solar y use sombrero.</Text>
        </View>
        <View style={{ backgroundColor: conseguirColor(5), width: "95%", height: "18%", borderRadius: 10, marginTop: "2%", alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 12, fontWeight: '500' }}>Puede disfrutar del sol con precausión.</Text>
        </View>
      </View>
    </View>
  );
}