import {
  Box,Grid,Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { RequestServer } from "../api/HttpReq";
import { Bar, Doughnut, Line, Pie, PolarArea, Radar } from "react-chartjs-2";
import "./home.css";
import { apiMethods } from "../api/methods";
import useViewport from "../../utility/useViewPort";
import CircularProgress from '@mui/material/CircularProgress';
import { GET_DEAL } from "../api/endUrls";

function DashboardIndex() {
  const URL_getRecords = GET_DEAL;


  const { width, breakpoint } = useViewport();

  console.log(width, "sc size width");
  console.log(breakpoint, "sc size breakpoint");

  const [records, setRecords] = useState([]);
  const [fetchLoading ,setFetchLoading]=useState(true)
  
  console.log();
  useEffect(() => {
    setTimeout(()=>{
      fetchRecords();
    },3000)
  }, []);

  const fetchRecords = () => {
      RequestServer(apiMethods.get,URL_getRecords)
        .then((res) => {
          console.log(res, "Dashboard index page res");
          console.log("Dashboard Opportunity Data", res.data);
          if (res.success) {
            setRecords(res.data);
            setFetchLoading(false)
          } else {
            setRecords([]);
          }
          console.log("closedate is ", records.closeDate);
        })
        .catch((error) => {
          console.log("Dashboard Opportunity Error is :", error);
        });
  };

  const mobileView = width < breakpoint ? 12 : 6;

  
  const opportunityType = records.length>0 && records.reduce((acc, obj) => {
    const key = obj.stage;
    if (key.length > 0) {
      if (!acc[key]) {      
        acc[key] = { type: key, count: 0 };
      }

      acc[key].count += 1;
    }
    return acc;
  }, {});

  const sortedRecords = records.length>0 && records.sort((a, b) => {
    const aMonth = new Date(a.closeDate).getMonth();
    const bMonth = new Date(b.closeDate).getMonth();
    return aMonth - bMonth;
  });

  console.log("sortedRecords is :", sortedRecords);
  const groupedData1 = sortedRecords.length>0 && sortedRecords
    .filter((obj) => obj.stage === "Closed Won")
    .reduce((acc, curr) => {
      console.log("acc is :", acc);
      console.log("curr is :", curr);
      const closeDate = new Date(curr.closeDate);
      const monthYear = closeDate.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });
      acc[monthYear] = acc[monthYear] || { totalAmount: 0, count: 0 };
      acc[monthYear].totalAmount += parseInt(curr.amount);
      acc[monthYear].count += 1;
      return acc;
    }, {});

  console.log("groupedData1 is :", groupedData1);
  console.log("groupedData1 key is :", Object.keys(groupedData1));
  console.log("groupedData1 value is :", Object.values(groupedData1));

  const BarChartData = {
    labels: Object.keys(opportunityType),
    datasets: [
      {
        label: "Opportunities",
        backgroundColor: [
          "#83984d",
          "#A680C2",
          "#f0b51f",
          "#CAE0DC",
          "#336b8b",
          "#96A4DD",
        ],
        borderColor: "grey",
        data: Object.values(opportunityType).map((obj) => obj.count),
      },
    ],
  };

  const labels = Object.keys(groupedData1);

  const dataValues = Object.values(groupedData1).map((obj) => obj.totalAmount);
  console.log("object value is :", Object.values(groupedData1));
  console.log("datavalues is :", dataValues);
  const countValues = Object.values(groupedData1).map((obj) => obj.count);
  console.log("countvalues is :", countValues);

  const StackedBarChartData = {
    labels: labels,
    datasets: [
      {
        label: `Closed Won (Total Amount)`,
        backgroundColor: [
          "#045FB0",
          "#FFDF01",
          "#34D991",
          "#83984d",
          "#A680C2",
          "#f0b51f",
          "#CAE0DC",
          "#336b8b",
          "#96A4DD",
        ],
        borderColor: "black",
        data: dataValues,
        Legend: {
          display: true,
          position: "bottom",
        },
      },      
    ],
    
  };

 


  let finalArray = records.length>0 && records.filter((obj) => obj.stage === "Closed Won");
  console.log("finalArray is ", finalArray);


  return (
    <>
     {   fetchLoading ? (
      <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="200px"
    >
      <CircularProgress />
    </Box>
  ) : (
      <Box className="box-container">
        <Grid container spacing={2}>
          <Grid item xs={mobileView} sm={6}>
            <Typography
              variant="h3"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                textShadow: "3px 3px 4px silver",
              }}
            >
              Overall Opportunities
            </Typography>
           
            <br />
            {BarChartData && (
              <Doughnut className="pie-chart" data={BarChartData} />
            )}
          </Grid>

          <Grid item xs={mobileView} sm={6}>
            <Typography
              variant="h3"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                textShadow: "3px 3px 4px silver",
              }}
            >
              Monthly Total Amount
            </Typography>
            <br />
            {StackedBarChartData && (
              <Bar
                style={{ height: "360px" }}
                className="pie-chart"
                data={StackedBarChartData}
              />
            )}
          </Grid>
        </Grid>
      </Box>
  )}
    </>
  );
}

export default DashboardIndex;
