import React from 'react';
import Chart from 'react-apexcharts';

const BarChart = ({ chartData }) => {
  const options = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: chartData.map((dataPoint) => dataPoint.x),
    },
    yaxis: {
      title: {
        text: 'Count',
      },
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
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default BarChart;
