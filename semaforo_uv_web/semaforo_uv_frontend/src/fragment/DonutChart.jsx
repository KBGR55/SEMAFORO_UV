import React from 'react';

const DonutChart = ({ uv }) => {
  let data;

  if (uv <= 2) {
    data = [
      { color: '#299501', value: 20 },
      { color: '#F8EEB0', value: 20 },
      { color: '#F7BFB2', value: 20 },
      { color: '#D7AEB8', value: 20 },
      { color: '#D882EE', value: 20 },
    ];
  } else if (uv <= 5) {
    data = [
      { color: '#ADE1CA', value: 20 },
      { color: '#F8E600', value: 20 },
      { color: '#F7BFB2', value: 20 },
      { color: '#D7AEB8', value: 20 },
      { color: '#D882EE', value: 20 },
    ];
  } else if (uv <= 7) {
    data = [
      { color: '#ADE1CA', value: 20 },
      { color: '#F8EEB0', value: 20 },
      { color: '#F85A00', value: 20 },
      { color: '#D7AEB8', value: 20 },
      { color: '#D882EE', value: 20 },
    ];
  } else if (uv <= 10) {
    data = [
      { color: '#ADE1CA', value: 20 },
      { color: '#F8EEB0', value: 20 },
      { color: '#F7BFB2', value: 20 },
      { color: '#D7001F', value: 20 },
      { color: '#D882EE', value: 20 },
    ];
  } else {
    data = [
      { color: '#ADE1CA', value: 20 },
      { color: '#F8EEB0', value: 20 },
      { color: '#F7BFB2', value: 20 },
      { color: '#D7AEB8', value: 20 },
      { color: '#6A4AC7', value: 20 },
    ];
  }

  // Función para generar los segmentos de pastel
  const generatePieSegments = () => {
    let cumulativeValue = 0;
    return data.map((segment, index) => {
      const { color, value } = segment;
      const startAngle = ((cumulativeValue / 100) * 180) - 90;
      cumulativeValue += value;
      const endAngle = ((cumulativeValue / 100) * 180) - 90;
      return <path key={index} d={describeArc(100, 100, 100, 80, startAngle, endAngle)} fill={color} />;
    });
  };

  // Función para generar la descripción del arco
  const describeArc = (x, y, radius, innerRadius, startAngle, endAngle) => {
    const startOuterRadians = (startAngle - 90) * Math.PI / 180;
    const endOuterRadians = (endAngle - 90) * Math.PI / 180;
    const startInnerRadians = (startAngle - 90) * Math.PI / 180;
    const endInnerRadians = (endAngle - 90) * Math.PI / 180;

    const outerStartX = x + radius * Math.cos(startOuterRadians);
    const outerStartY = y + radius * Math.sin(startOuterRadians);
    const outerEndX = x + radius * Math.cos(endOuterRadians);
    const outerEndY = y + radius * Math.sin(endOuterRadians);

    const innerStartX = x + innerRadius * Math.cos(startInnerRadians);
    const innerStartY = y + innerRadius * Math.sin(startInnerRadians);
    const innerEndX = x + innerRadius * Math.cos(endInnerRadians);
    const innerEndY = y + innerRadius * Math.sin(endInnerRadians);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return `
      M ${outerStartX} ${outerStartY}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}
      L ${innerEndX} ${innerEndY}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}
      Z
    `;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <svg height="40%" width="90%" viewBox="0 0 200 140">
        {generatePieSegments()}
      </svg>
      <div style={{ position: 'absolute', bottom: '10%', fontSize: '40px', fontWeight: 'bold', color: '#0080ff' }}>
      Min: 0 - Max: 15
      </div>
      <div style={{ position: 'absolute', bottom: '30%', fontSize: '75px', fontWeight: 'bold', color: '#0c2342' }}>
        {uv}
      </div>
    </div>
  );
};

export default DonutChart;
