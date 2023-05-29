import React from 'react';
import Chart from 'react-apexcharts';

const PieChart = ({ chartData }) => {
  const options = {
    chart: {
      type: 'pie',
    },
    labels: chartData.map((dataPoint) => dataPoint.x),
  };

  const series = chartData.map((dataPoint) => dataPoint.y);

  return (
    <div>
      <Chart options={options} series={series} type="pie" height={350} />
    </div>
  );
};

export default PieChart;
