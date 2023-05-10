import {
  Box,
  Grid,
  Paper,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { RequestServer } from "../api/HttpReq";
import { Bar, Doughnut, Line, Pie, PolarArea, Radar } from "react-chartjs-2";
import "./home.css";

function DashboardIndex() {
  const urlOpportunity = `/opportunities`;

  const filterOptions = [
    { label: "Filter A", value: "FilterA" },
    { label: "Filter B", value: "FilterB" },
    { label: "Filter C", value: "FilterC" },
  ];

  const [records, setRecords] = useState([]);
  const [selectedFilterOption, setSelectedFilterOption] = useState(
    filterOptions[0].value
  );

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    if (selectedFilterOption.length > 1) {
      RequestServer(urlOpportunity)
        .then((res) => {
          console.log(res, "Dashboard index page res");
          console.log("Dashboard Opportunity Data", res.data);
          if (res.success) {
            setRecords(res.data);
          } else {
            setRecords([]);
          }
          console.log("closedate is ", records.closeDate);
        })
        .catch((error) => {
          console.log("Dashboard Opportunity Error is :", error);
        });
    }
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

  // const groupedData = records.reduce((acc, curr) => {
  //   console.log("groupedData acc is :", acc);
  //   console.log("groupedData curr is :", curr);
  //   const closeDate = new Date(curr.closeDate);
  //   console.log("closedate is :", closeDate);
  //   const monthYear = closeDate.toLocaleString("default", {
  //     month: "short",
  //     year: "numeric",
  //   });
  //   const amount = parseInt(curr.amount);
  //   const stage = curr.stage;

  //   if (!acc[monthYear]) {
  //     acc[monthYear] = {};
  //   }

  //   if (!acc[monthYear][stage]) {
  //     acc[monthYear][stage] = {
  //       monthYear: monthYear,
  //       stage: stage,
  //       totalAmount: amount,
  //       data: [curr],
  //     };
  //   } else {
  //     acc[monthYear][stage].totalAmount += amount;
  //     acc[monthYear][stage].data.push(curr);
  //   }

  //   return acc;
  // }, {});

  // console.log("grouped data is :", groupedData);
  // console.log("grouped data Key is :", Object.keys(groupedData));
  // console.log("grouped data value is :", Object.values(groupedData));

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

  // const Barcounts = records.reduce((acc, obj) => {
  //   // console.log("acc is :", acc);
  //   // console.log("obj is", obj);

  //   const key = obj.stage;
  //   // console.log("Key is", key);
  //   if (key.length > 0) {
  //     if (!acc[key]) {
  //       acc[key] = { stage: key, count: 0 };
  //     }
  //   }
  //   acc[key].count += 1;
  //   return acc;
  // }, {});

  // console.log("Barcounts is :", Barcounts);
  // console.log("Barcounts Key is :", Object.keys(Barcounts));
  // console.log("Barcounts Value is :", Object.values(Barcounts));

  const opportunityType = records.reduce((acc, obj) => {
    // console.log(" opportunityType acc is :", acc);
    // console.log("opportunityType obj is", obj);
    const key = obj.stage;

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
  // const sortedRecords = records.sort((a, b) =>
  //   a.closeDate > a.closeDate ? 1 : -1
  // );
  const sortedRecords = records.sort((a, b) => {
    const aMonth = new Date(a.closeDate).getMonth();
    const bMonth = new Date(b.closeDate).getMonth();
    return aMonth - bMonth;
  });
  console.log("sortedRecords is :", sortedRecords);
  const groupedData1 = sortedRecords
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
      // {
      //   label: "Number of Closed Won Deals",
      //   backgroundColor: ["#7A3653", "#F8DFBA", "#6B8A58"],
      //   borderColor: "black",
      //   data: countValues,
      // },
    ],
    // {
    //   label: "Closed Lost",
    //   backgroundColor: "white",
    //   borderColor: "rgb(255, 99, 132)",
    //   data: Object.values(groupedData).map(
    //     (obj) => obj.stage === "Closed Lost"
    //   ),
    // },
  };

  const handleFilterChange = (event) => {
    setSelectedFilterOption(event.target.value);
  };

  // if (selectedFilterOption === "FilterA") {
  //   BarChartData.datasets[0].data = Object.values(Barcounts).map(
  //     (obj) => obj.stage
  //   );
  // } else if (selectedFilterOption === "FilterB") {
  //   BarChartData.datasets[0].data = [15, 30, 45, 60, 75, 90, 105];
  // }

  let finalArray = records.filter((obj) => obj.stage === "Closed Won");
  console.log("finalArray is ", finalArray);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Monthly Total Amount",
      },
    },
  };

  return (
    <>
      <Box className="box-container">
        <Grid container spacing={2}>
          <Grid item xs={5}>
            {/* <Paper elevation={12} className="chart-box"> */}
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
            {/* <Select
              options={filterOptions}
              value={selectedFilterOption}
              onChange={(option) => setSelectedFilterOption(option.value)}
            /> */}
            {/* <div style={{ display: "flex", float: "right" }}>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">
                  <b>Filter</b>
                </InputLabel>
                <Select
                  value={selectedFilterOption}
                  label="Filter"
                  onChange={(event) => handleFilterChange(event)}
                >
                  <MenuItem value="None">
                    <em>None</em>
                  </MenuItem>
                  {filterOptions.map((item) => (
                    <MenuItem value={item.value}>{item.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>*/}
            <br />
            {BarChartData && (
              <Doughnut className="pie-chart" data={BarChartData} />
            )}
            {/* </Paper> */}
          </Grid>

          <Grid item xs={7}>
            {/* <Paper elevation={12} className="chart-box"> */}
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
                className="count-bar-chart"
                options={options}
                data={StackedBarChartData}
              />
            )}

            {/* </Paper> */}
          </Grid>

          <Grid item xs={5}>
            {/* <Paper elevation={12} className="chart-box"> */}
            {/* <Typography
              variant="h3"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                textShadow: "3px 3px 4px silver",
              }}
            >
              Inventory Types
            </Typography>
            <br />
            <Bar className="pie-chart" data={DoughnutChartData} /> */}
            {/* </Paper> */}
          </Grid>

          <Grid item xs={7}>
            {/* <Paper elevation={12} className="chart-box"> */}
            {/* <Typography
              variant="h3"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                textShadow: "3px 3px 4px silver",
              }}
            >
              Total Amount And No Of Opportunities
            </Typography>
            <br />
            <Doughnut className="pie-chart" data={StackedBarChartData} /> */}
            {/* </Paper> */}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default DashboardIndex;
