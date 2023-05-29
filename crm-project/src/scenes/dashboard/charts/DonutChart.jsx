import React from 'react';
import Chart from 'react-apexcharts';

const DonutChart = ({ chartData }) => {
 console.log("inside donut chart",chartData)
  const options = {
    chart: {
      type: 'donut',
    },
    labels: chartData.map((dataPoint) => `${dataPoint.x.trim()}`),
  };

  const series = chartData.map((dataPoint) => dataPoint.y);

  return (
    <div>
      <Chart options={options} series={series} type="donut" height={350} />
    </div>
  );
};

export default DonutChart;
