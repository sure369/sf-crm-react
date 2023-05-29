import React from 'react';
import Chart from 'react-apexcharts';

const RadialBarChart = ({ chartData }) => {
  const options = {
    plotOptions: {
      radialBar: {
        dataLabels: {
          total: {
            show: true,
            label: 'Total',
          },
        },
      },
    },
    labels: chartData.map((dataPoint) => dataPoint.x),
  };

  const series = chartData.map((dataPoint) => dataPoint.y);

  return (
    <div>
      <Chart options={options} series={series} type="radialBar" height={350} />
    </div>
  );
};

export default RadialBarChart;
