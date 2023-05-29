import React from 'react';
import Chart from 'react-apexcharts';

const PolarAreaChart = ({ chartData }) => {
  console.log(chartData,"chartData PolarAreaChart")

  const options = {
    labels: chartData.map((dataPoint) => dataPoint.x),
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 0,
        },
        spokes: {
          strokeWidth: 0,
        },
      },
    },
  };

  const series = chartData.map((dataPoint) => dataPoint.y);

  return (
    <div>
      <Chart options={options} series={series} type="polarArea" height={350} />
    </div>
  );
};

export default PolarAreaChart;
