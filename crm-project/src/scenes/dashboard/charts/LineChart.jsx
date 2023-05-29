// import React from 'react';
// import ReactApexChart from 'react-apexcharts';

// const LineChart = ({ chartData }) => {
//   console.log("inside line chart chartData",chartData)
//   const labels = chartData.map((item) => item.label);
//   const dataValues = chartData.map((item) => item.value);

//   const options = {
//     chart: {
//       type: 'line',
//     },
//     // Additional options specific to line chart
//   };

//   const series = [
//     {
//       name: 'Data',
//       data: dataValues,
//     },
//   ];

//   return (
//     <ReactApexChart options={options} series={series} type="line" width="100%" height={360} />
//   );
// };

// export default LineChart;

import React from 'react';
import ReactApexChart from 'react-apexcharts';

const LineChart = ({ chartData }) => {
  const options = {
    chart: {
      type: 'line',
    },
    series: [
      {
        name: 'Count',
        data: chartData,
      },
    ],
    xaxis: {
      type: 'category',
    },
  };

  return (
    <div>
      <ReactApexChart options={options} series={options.series} type={options.chart.type} height={350} />
    </div>
  );
};

export default LineChart;
