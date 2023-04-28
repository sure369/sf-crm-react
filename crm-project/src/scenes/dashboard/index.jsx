// import { Box } from "@mui/material";
// import React, { useState, useEffect } from "react";
// import "./dashboard.css";
// import { RequestServer } from "../api/HttpReq";
// import { Chart } from "react-chartjs-2";
// import { Bar } from "react-chartjs-2";
// import { Legend, Title, plugins } from "chart.js";
// import { CategoryScale } from "chart.js";

// const labels = ["January", "February", "March", "April", "May", "June", "July"];

// function DashboardIndex() {
//   const urlOpportunity = `${process.env.REACT_APP_SERVER_URL}/opportunities`;

//   const [records, setRecords] = useState([]);

//   const Data = {
//     labels: labels,
//     // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
//     datasets: [
//       {
//         label: "Opportunities",
//         data: records,
//         // you can set indiviual colors for each bar
//         backgroundColor: [
//           "rgba(255, 255, 255, 0.6)",
//           "rgba(255, 255, 255, 0.6)",
//           "rgba(255, 255, 255, 0.6)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const [chartData, setChartData] = useState({
//     labels: Data.map((data) => data.year),
//     datasets: [
//       {
//         label: "Users Gained ",
//         data: Data.map((data) => data.userGain),
//         backgroundColor: [
//           "rgba(75,192,192,1)",
//           "#ecf0f1",
//           "#50AF95",
//           "#f3ba2f",
//           "#2a71d0",
//         ],
//         borderColor: "black",
//         borderWidth: 2,
//       },
//     ],
//   });

//   useEffect(() => {
//     fetchRecords();
//   }, []);

//   const fetchRecords = () => {
//     RequestServer("post", urlOpportunity, null, {})
//       .then((res) => {
//         console.log(res, "Dashboard index page res");
//         console.log("Dashboard Opportunity Data", res.data);
//         setRecords(res.data);
//       })
//       .catch((error) => {
//         console.log("Dashboard Opportunity Error is :", error);
//       });
//   };

//   return (
//     <>
//       <Box className="dashboard-index">
//         <Bar data={Data} />
//       </Box>
//     </>
//   );
// }

// export default DashboardIndex;

import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import "./dashboard.css";
import { RequestServer } from "../api/HttpReq";
import { Box } from "@mui/material";
import { Pie } from "react-chartjs-2";

const DashboardIndex = () => {
  const urlOpportunity = `${process.env.REACT_APP_SERVER_URL}/opportunities`;

  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    RequestServer("post", urlOpportunity, null, {})
      .then((res) => {
        console.log(res, "Dashboard index page res");
        console.log("Dashboard Opportunity Data", res.data);
        setRecords(res.data);
        console.log("closedate is ", records.closeDate);
      })
      .catch((error) => {
        console.log("Dashboard Opportunity Error is :", error);
      });
  };

  const stageRecords = records.map((i) => i.stage);
  //   const stageLabel = records.map(())

  const counts = records.reduce((acc, obj) => {
    const key = obj.stage;
    if (!acc[key]) {
      acc[key] = { stage: key, count: 0 };
    }
    acc[key].count += 1;
    return acc;
  }, {});

  const Barcounts = records.reduce((acc, obj) => {
    console.log("acc is :", acc);
    console.log("obj is", obj);
    const key = obj.type;

    console.log("Key is :", key.length);
    if (key.length > 0) {
      if (!acc[key]) {
        console.log("inside if Barcounts");

        acc[key] = { type: key, count: 0 };
      }

      acc[key].count += 1;
    }
    return acc;
  }, {});

  // const key = records.map((rec) => rec.type);
  // console.log("Key is :", key);

  const LineChartData = {
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Opportunities",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "#243665",
        data: Object.values(counts).map((obj) => obj.count),
      },
    ],
  };

  const BarChartData = {
    labels: Object.keys(Barcounts),
    datasets: [
      {
        label: "Opportunities",
        backgroundColor: "#4A274F",
        borderColor: "rgb(255, 99, 132)",
        data: Object.values(Barcounts).map((obj) => obj.count),
      },
    ],
  };

  const chartOptions = {
    title: {
      display: true,
      text: "Average Rainfall per month",
      fontSize: 20,
    },
    legend: {
      display: true,
      position: "right",
    },
  };

  const PieChartData = {
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Opportunities",
        backgroundColor: [
          "#3D3D3D",
          "#F7B7A3",
          "#EA5F89",
          "#9B3192",
          "#57167E",
          "#2B0B3F",
        ],
        hoverBackgroundColor: [
          "#501800",
          "#4B5000",
          "#175000",
          "#003350",
          "#35014F",
        ],
        borderColor: [
          "rgba(48, 82, 175, 0.8)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
        data: Object.values(counts).map((obj) => obj.count),
      },
    ],
  };

  return (
    <>
      <Box className="dashboard-index">
        <Line
          className="line-chart"
          data={LineChartData}
          options={chartOptions}
        />
      </Box>
      <br />
      <Box className="dashboard-index">
        <Bar className="bar-chart" data={BarChartData} options={chartOptions} />
      </Box>
      <Box className="dashboard-index">
        <Pie className="pie-chart" data={PieChartData} options={chartOptions} />
      </Box>
    </>
  );
};

export default DashboardIndex;
