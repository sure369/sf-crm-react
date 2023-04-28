import { Box, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { RequestServer } from "../api/HttpReq";
import { Bar } from "react-chartjs-2";
import "./home.css";

function HomePage() {
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

  // const groupedData = records.reduce((acc, obj) => {
  //   const key = `${obj.stage}-${obj.amount}-${new Date(
  //     obj.closeDate
  //   ).getMonth()}`;
  //   if (!acc[key]) {
  //     acc[key] = {
  //       // stage: obj.stage,
  //       amount: obj.amount,
  //       month: new Date(obj.closeDate).toLocaleString("en-US", {
  //         month: "short",
  //       }),
  //     };
  //   } else {
  //     acc[key].data.push(obj);
  //   }
  //   return acc;
  // }, {});

  const groupedData = records.reduce((acc, curr) => {
    const closeDate = new Date(curr.closeDate);
    const monthYear = closeDate.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    const amount = parseInt(curr.amount);
    const stage = curr.stage;

    if (!acc[monthYear]) {
      acc[monthYear] = {};
    }

    if (!acc[monthYear][stage]) {
      acc[monthYear][stage] = {
        monthYear: monthYear,
        stage: stage,
        totalAmount: amount,
        data: [curr],
      };
    } else {
      acc[monthYear][stage].totalAmount += amount;
      acc[monthYear][stage].data.push(curr);
    }

    return acc;
  }, {});

  console.log("grouped data is :", groupedData);

  // // Group the data based on closeDate month and stage
  // const groupedData = records.reduce((acc, cur) => {
  //   // Convert the closeDate timestamp to a date object
  //   const date = new Date(cur.closeDate);
  //   console.log("date is:", date);

  //   // Get the month and year from the date object
  //   const month = date.toLocaleString("en-US", { month: "short" });
  //   console.log("month is:", month);
  //   const year = date.getFullYear();
  //   console.log("year is:", year);

  //   // Create a key for the group based on the month, year, and stage
  //   const key = `${month}-${year}-${cur.stage}`;

  //   console.log("Key is:", key);

  //   // Add the amount to the total for the group
  //   if (!acc[key]) {
  //     acc[key] = { month, year, stage: cur.stage, amount: Number(cur.amount) };
  //   } else {
  //     acc[key].amount += Number(cur.amount);
  //   }

  //   return acc;
  // }, {});

  // Convert the groupedData object into an array
  // const groupedArray = Object.values(groupedData);

  const Barcounts = records.reduce((acc, obj) => {
    const key = obj.stage;
    if (!acc[key]) {
      acc[key] = { stage: key, count: 0 };
    }
    acc[key].count += 1;
    return acc;
  }, {});

  const opportunityType = records.reduce((acc, obj) => {
    // console.log("acc is :", acc);
    // console.log("obj is", obj);
    const key = obj.type;

    // console.log("Key is :", key.length);
    if (key.length > 0) {
      if (!acc[key]) {
        // console.log("inside if Barcounts");

        acc[key] = { type: key, count: 0 };
      }

      acc[key].count += 1;
    }
    return acc;
  }, {});

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

  const StackedBarChartData = {
    labels: Object.keys(Barcounts),
    datasets: [
      {
        label: "Closed Won",
        backgroundColor: "black",
        borderColor: "rgb(255, 99, 132)",
        data: Object.values(Barcounts).map((obj) => obj.stage),
      },
      {
        label: "Closed Lost",
        backgroundColor: "white",
        borderColor: "rgb(255, 99, 132)",
        data: Object.values(Barcounts).map((obj) => obj.stage),
      },
    ],
  };

  return (
    <>
      <Box className="box-container">
        <Paper elevation={12} className="chart-box">
          <Bar className="bar-chart" data={BarChartData} />
        </Paper>

        <Paper elevation={12} className="chart-box">
          <Bar className="bar-chart" data={StackedBarChartData} />
        </Paper>
      </Box>
    </>
  );
}

export default HomePage;
