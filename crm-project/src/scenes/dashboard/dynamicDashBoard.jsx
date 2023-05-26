import {
    Box, Grid, Paper, Typography, Select, FormControl,
    InputLabel, MenuItem, SwipeableDrawer, Button, Divider, Accordion,
    AccordionSummary, AccordionDetails, TextField, InputAdornment, List, ListItemIcon,
    ListItem, ListItemText, ListItemButton,

} from "@mui/material";
import React, { useEffect, useState } from "react";
import { RequestServer } from "../api/HttpReq";
import axios from "axios";
import { Bar, Bubble, Chart, Doughnut, Line, Pie, PolarArea, Radar, } from "react-chartjs-2";
import CircularProgressWithLabel from "../styles/CircularProgressWithLabel";
import "../recordDetailPage/Form.css"
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import queryString from "query-string";
import ToastNotification from "../toast/ToastNotification";
import { Delete, ExpandMore } from "@mui/icons-material";
import './dashboard.css'
import { GetTableNames } from "../global/getTableNames";
import DashboardDetailPage from "./dashboardDetailPage";
import DashBoardRecords from ".";
import DashboardCharts from "./dashboardCharts";

function DynamicHomePage() {
    // const URL_get
    const urlOpportunity = `${process.env.REACT_APP_SERVER_URL}/opportunities`;
    const urlLead = `${process.env.REACT_APP_SERVER_URL}/leads`;
    const urlAccount = `${process.env.REACT_APP_SERVER_URL}/accounts`;
    const urlInventory = `${process.env.REACT_APP_SERVER_URL}/inventories`;

    const urlTabs = `${process.env.REACT_APP_SERVER_URL}/tabs`;
    const urlFields = `${process.env.REACT_APP_SERVER_URL}/fields`;
    const urlDashboard = `${process.env.REACT_APP_SERVER_URL}/dashboardGroup`;
    const urlPostDashboard = `${process.env.REACT_APP_SERVER_URL}/Dashboard`;
    const urlGetDashboards = `${process.env.REACT_APP_SERVER_URL}/dashboards`
    const urlDeleteDashboards = `${process.env.REACT_APP_SERVER_URL}/dashboard/`

    const user = JSON.parse(sessionStorage.getItem('loggedInUser'))


    const ChartTypes = [{ chart: "Bar" }, { chart: "Pie" }, { chart: "Doughnut" }, { chart: "Line" }, { chart: "Polar" }, { chart: "Radar" }];

    const [records, setRecords] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [selectedObject, setSelectedObject] = useState([]);

    const [selectedUrl, setSelectedUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedChart, setSelectedChart] = useState("None");
    const [fields, setFields] = useState();
    const [selectedFields, setSelectedFields] = useState([]);
    const [notify, setNotify] = useState({ isOpen: false, message: "", type: "", });
    const [dashboardData, setDashboardData] = useState("");
    const [dashboardName, setDashboardName] = useState("");
    const [dashboardFiles, setDashboardFiles] = useState([]);
    const [chartData, setChartData] = useState({});


    const [selectedDashboard, setSelectedDashboard] = useState(null);

    // Function to handle row click in DashBoardRecords
    const handleRowClick = (dashboard) => {

      setSelectedDashboard(dashboard);
    };




    return (
        <>
            <ToastNotification notify={notify} setNotify={setNotify} />
            <Box className="box-container">
                <Grid container spacing={2} >
                    <Grid item xs={10} lg={4} sm={8} xl={4}>
                        <Box className="filter-box" >
                            <Accordion sx={{ borderRadius: "5px", margin: "10px" }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-label="Expand"
                                    aria-controls="-content"
                                    id="-header"
                                >
                                    <Typography variant="h4" fontWeight="bold">
                                        New Dashboard
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DashboardDetailPage dashboard={selectedDashboard} />
                                </AccordionDetails>
                            </Accordion>

                            <Accordion sx={{ borderRadius: "5px", margin: "10px" }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-label="Expand"
                                    aria-controls="-content"
                                    id="-header"
                                >
                                    <Typography variant="h4" fontWeight="bold">
                                        Existing Dashboards
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DashBoardRecords handleRowClick={handleRowClick} />
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </Grid>

                    <Grid item xs={10} lg={8} sm={10} xl={8}>

                        <Typography
                            variant="h3"
                            sx={{
                                textAlign: "center",
                                fontWeight: "bold",
                                textShadow: "3px 3px 4px silver",
                            }}
                        >
                            DashBoard
                        </Typography>
                        <Box display="flex" alignItems="center"></Box>
                        <br />
                        <DashboardCharts dashboard={selectedDashboard} />
                    </Grid>
                </Grid>
            </Box >
        </>
    );
}

export default DynamicHomePage;

