import React, { useEffect, useState } from 'react';
import { Bar, Bubble, Doughnut, Line, Pie, PolarArea, Radar } from "react-chartjs-2";
import { GET_DASHBOARD_OBJECT_FIELD } from '../api/endUrls';
import { RequestServer } from '../api/HttpReq';
import { apiMethods } from '../api/methods';

function DashboardCharts({ dashboard }) {
  const URL_getDashboard = GET_DASHBOARD_OBJECT_FIELD;
  const [chartType, setChartType] = useState();
const [dashboardData,setDashboardData]=useState([])

  useEffect(() => {
    if (dashboard) {
      fetchRecords(dashboard);
      setChartType(dashboard.object);
    }
  }, [dashboard]);

  const fetchRecords = (item) => {
    console.log(item,"fetchRecords item")
    RequestServer(apiMethods.get, `${URL_getDashboard}?object=${item.objectName}&field=${item.fields}`)
      .then((res) => {
        console.log(res, "fetchRecords");
        if(res.success){
            setDashboardData(res.data)
        }else{            
        setDashboardData([])
        }
      })
      .catch((err) => {
        setDashboardData([])
        console.log(err, "fetchRecords error");
      });
  };

 const dashboardLabel = dashboardData && dashboardData.map((item) => item._id);
  let keyData;
  const label = dashboardLabel && dashboardLabel.map((obj) => {
    console.log('obj is ', obj);
    keyData = Object.values(obj);
    return `${Object.values(obj)}`;
  });
  console.log('label is ', label);
  console.log(keyData);

  console.log("dashboardLabel is", dashboardLabel);

  const dashboardDataset = dashboardData && dashboardData.map((item) => item.count);

  const BarChartData = {
    labels: label,
    datasets: [
      {
        label: `${dashboardData?.object} - `,
        backgroundColor: [
          "#83984d",
          "#800020",
          "#f0b51f",
          "#ea700b",
          "#336b8b",
          "#423f3f",
        ],
        borderColor: "black",
        data: dashboardDataset,
      },
    ],
  };

  console.log(BarChartData, "BarChartData");

  return (
    <>

      {/* {BarChartData && dashboard?.chartType === "Bar" ? (
        <Bar className="count-bar-chart" data={BarChartData} />
      ) : dashboard && dashboard?.chartType === "Pie" ? (
        <Pie className="pie-chart" data={BarChartData} />
      ) : dashboard && dashboard?.chartType === "Doughnut" ? (
        <Doughnut className="pie-chart" data={BarChartData} />
      ) : dashboard && dashboard?.chartType === "Line" ? (
        <Line className="count-bar-chart" data={BarChartData} />
      ) : dashboard && dashboard?.chartType === "Polar" ? (
        <PolarArea className="count-bar-chart" data={BarChartData} />
      ) : dashboard && dashboard?.chartType === "Radar" ? (
        <Radar className="count-bar-chart" data={BarChartData} />
      ) : (
        <Bar className="count-bar-chart" data={BarChartData} />
      )} */}
    </>
  );
}

export default DashboardCharts;

// import React, { useEffect,useState } from 'react'
// import { Bar, Bubble, Chart, Doughnut, Line, Pie, PolarArea, Radar, } from "react-chartjs-2";
// import { GET_DASHBOARD_OBJECT_FIELD } from '../api/endUrls';
// import { RequestServer } from '../api/HttpReq';
// import { apiMethods } from '../api/methods';

// function DashboardCharts({dashboard}) {

//     const URL_getDashboard=GET_DASHBOARD_OBJECT_FIELD

//     const[chartType,setChartType]=useState()

//     console.log(dashboard,"dashboard in chartPage")

//     useEffect(()=>{
//         if(dashboard){
//             fetchRecords(dashboard)
//             setChartType(dashboard.object)
//         }  
//     },[dashboard])

//     const fetchRecords=(item)=>{
//         RequestServer(apiMethods.get,URL_getDashboard `?object=${item.object}&field=${item.field}`)
//         .then((res)=>{
//             console.log(res,"fetchRecords")
//         })
//         .catch((err)=>{
//             console.log(err,"fetchRecords error")
//         })
//     }
    
//     const dashboardLabel = dashboard && dashboard.map(item => item._id)
//     let keyData
//     const label = dashboardLabel && dashboardLabel.map(obj => {
//         console.log('obj is ', obj);
//         keyData = Object.values(obj)
//         return `${Object.values(obj)}`
//     })
//     console.log('label is ', label);
//     console.log(keyData);

//     console.log("dashboardLabel is", dashboardLabel);

//     const dashboardDataset = dashboard && dashboard.map(item => item.count);


//     const BarChartData = {
//         labels: label,
//         datasets: [
//             {
//                 label: `${dashboard?.object} - `,
//                 backgroundColor: [
//                     "#83984d",
//                     "#800020",
//                     "#f0b51f",
//                     "#ea700b",
//                     "#336b8b",
//                     "#423f3f",
//                 ],
//                 borderColor: "black",
//                 data: dashboardDataset,
//             },
//         ],
//     };

//     console.log(BarChartData,"BarChartData")

//     return (
//    <>
    
//                          {/* {BarChartData &&
//                             dashboard.chartType === "Bar" ? 
//                             (
//                             <Bar className="count-bar-chart" data={BarChartData}/>
//                         ) : dashboard.chartType === "Pie" ? (
//                             <Pie className="pie-chart" data={BarChartData} />
//                         ) : dashboard.chartType === "Doughnut" ? (
//                             <Doughnut className="pie-chart" data={BarChartData} />
//                         ) : dashboard.chartType === "Line" ? (
//                             <Line className="count-bar-chart" data={BarChartData} />
//                         ) : dashboard.chartType === "Polar" ? (
//                             <PolarArea className="count-bar-chart" data={BarChartData} />
//                         ) : dashboard.chartType === "Radar" ? (
//                             <Radar className="count-bar-chart" data={BarChartData} />
//                         ) : (
//                             <Bar className="count-bar-chart" data={BarChartData} />
//                         )} */}

// </>
//   )
// }

// export default DashboardCharts

