import React, { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { GET_DASHBOARD_OBJECT_FIELD } from '../api/endUrls';
import { RequestServer } from '../api/HttpReq';
import { apiMethods } from '../api/methods';

function DashboardCharts({ dashboard }) {
  const URL_getDashboard = GET_DASHBOARD_OBJECT_FIELD;
  const [chartType, setChartType] = useState();
  const [dashboardData, setDashboardData] = useState([]);
  const [showChart,setShowChart]=useState(false)


  useEffect(() => {
    if (dashboard) {
      console.log("useEffect")
      fetchRecords(dashboard);
      setChartType(dashboard.chartType);
    }
  }, [dashboard]);

  console.log(dashboard,"dashboard")
  
  const fetchRecords = (item) => {
    console.log(item, 'fetchRecords item');
    RequestServer(apiMethods.get, `${URL_getDashboard}?object=${item.objectName}&field=${item.fields}`)
      .then((res) => {
        console.log(res, 'fetchRecords');
        if (res.success) {
          setDashboardData(res.data);
        } else {
          setDashboardData([]);
        }
      })
      .catch((err) => {
        setDashboardData([]);
        console.log(err, 'fetchRecords error');
      });
  };

  const labels = dashboardData && dashboardData.map((item) => item._id);
  const dataValues = dashboardData && dashboardData.map((item) => item.count);

  const chartOptions = {
    options: {
      chart: {
        type: chartType,
      },
      xaxis: {
        categories: labels,
      },
    },
  };
  
  const seriesData = [
    {
      name: 'Count',
      data: dataValues,
    },
  ];

  console.log(chartOptions,"chartOptions")
  console.log(seriesData,"seriesData")

  return (
    <>
    {dashboardData.length > 0 && (
        <ReactApexChart
        options={chartOptions.options}
        series={seriesData}
        type={chartType}
        width="100%"
        height={360}
      />
      )}
    </>
  );
}

export default DashboardCharts;


// import React, { useEffect, useState } from 'react';
// import { Bar, Bubble, Doughnut, Line, Pie, PolarArea, Radar } from "react-chartjs-2";
// import { GET_DASHBOARD_OBJECT_FIELD } from '../api/endUrls';
// import { RequestServer } from '../api/HttpReq';
// import { apiMethods } from '../api/methods';

// function DashboardCharts({ dashboard }) {
//   const URL_getDashboard = GET_DASHBOARD_OBJECT_FIELD;
//   const [chartType, setChartType] = useState();
// const [dashboardData,setDashboardData]=useState([])

//   useEffect(() => {
//     if (dashboard) {
//       fetchRecords(dashboard);
//       setChartType(dashboard.object);
//     }
//   }, [dashboard]);

//   const fetchRecords = (item) => {
//     console.log(item,"fetchRecords item")
//     RequestServer(apiMethods.get, `${URL_getDashboard}?object=${item.objectName}&field=${item.fields}`)
//       .then((res) => {
//         console.log(res, "fetchRecords");
//         if(res.success){
//             setDashboardData(res.data)
//         }else{            
//         setDashboardData([])
//         }
//       })
//       .catch((err) => {
//         setDashboardData([])
//         console.log(err, "fetchRecords error");
//       });
//   };

//  const dashboardLabel = dashboardData && dashboardData.map((item) => item._id);
//   let keyData;
//   const label = dashboardLabel && dashboardLabel.map((obj) => {
//     console.log('obj is ', obj);
//     keyData = Object.values(obj);
//     return `${Object.values(obj)}`;
//   });
//   console.log('label is ', label);
//   console.log(keyData);

//   console.log("dashboardLabel is", dashboardLabel);

//   const dashboardDataset = dashboardData && dashboardData.map((item) => item.count);

//   const BarChartData = {
//     labels: label,
//     datasets: [
//       {
//         label: `${dashboardData?.object} - `,
//         backgroundColor: [
//           "#83984d",
//           "#800020",
//           "#f0b51f",
//           "#ea700b",
//           "#336b8b",
//           "#423f3f",
//         ],
//         borderColor: "black",
//         data: dashboardDataset,
//       },
//     ],
//   };

//   console.log(BarChartData, "BarChartData");

//   return (
//     <>

//       {BarChartData && dashboard?.chartType === "Bar" ? (
//         <Bar className="count-bar-chart" data={BarChartData} />
//       ) : dashboard && dashboard?.chartType === "Pie" ? (
//         <Pie className="pie-chart" data={BarChartData} />
//       ) : dashboard && dashboard?.chartType === "Doughnut" ? (
//         <Doughnut className="pie-chart" data={BarChartData} />
//       ) : dashboard && dashboard?.chartType === "Line" ? (
//         <Line className="count-bar-chart" data={BarChartData} />
//       ) : dashboard && dashboard?.chartType === "Polar" ? (
//         <PolarArea className="count-bar-chart" data={BarChartData} />
//       ) : dashboard && dashboard?.chartType === "Radar" ? (
//         <Radar className="count-bar-chart" data={BarChartData} />
//       ) : (
//         <Bar className="count-bar-chart" data={BarChartData} />
//       )}
//     </>
//   );
// }

// export default DashboardCharts;
