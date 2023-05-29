import React from 'react';
import Chart from 'react-apexcharts';

const RadarChart = ({ chartData }) => {
  const options = {
    chart: {
      type: 'radar',
    },
    xaxis: {
      categories: chartData.map((dataPoint) => dataPoint.x),
    },
  };

  const series = [
    {
      name: 'Series 1',
      data: chartData.map((dataPoint) => dataPoint.y),
    },
  ];

  return (
    <div>
      <Chart options={options} series={series} type="radar" height={350} />
    </div>
  );
};

export default RadarChart;
