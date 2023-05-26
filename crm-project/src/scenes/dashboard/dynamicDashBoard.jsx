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
import ToastNotification from "../toast/ToastNotification";
import { Delete, ExpandMore } from "@mui/icons-material";
import './dashboard.css'
import DashboardDetailPage from "./dashboardDetailPage";
import DashBoardRecords from ".";
import DashboardCharts from "./dashboardCharts";

function DynamicHomePage() {

    const [notify, setNotify] = useState({ isOpen: false, message: "", type: "", });
    const [selectedDashboard, setSelectedDashboard] = useState(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
  
    const handleRowClick = (dashboard) => {
      setSelectedDashboard(dashboard);
    };
  
    const handleFormSubmission = () => {
      setFormSubmitted(true);
    };


    return (
        <>
            <ToastNotification notify={notify} setNotify={setNotify} />
            <Box className="box-container">
                <Grid container spacing={2} >
                    <Grid item xs={10} lg={4} sm={8} xl={4}>
                        <Box className="filter-box" >
                            <Accordion sx={{ borderRadius: "5px", margin: "10px" }}>
                                <AccordionSummary expandIcon={<ExpandMore />}
                                    aria-label="Expand" aria-controls="-content" id="-header"
                                >
                                    <Typography variant="h4" fontWeight="bold">
                                        New Dashboard
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DashboardDetailPage 
                                        dashboard={selectedDashboard}
                                        onFormSubmit={handleFormSubmission} 
                                    />
                                </AccordionDetails>
                            </Accordion>

                            <Accordion sx={{ borderRadius: "5px", margin: "10px" }}>
                                <AccordionSummary  expandIcon={<ExpandMore />}
                                    aria-label="Expand" aria-controls="-content" id="-header"
                                >
                                    <Typography variant="h4" fontWeight="bold">
                                        Existing Dashboards
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DashBoardRecords 
                                    handleRowClick={handleRowClick}
                                    formSubmitted={formSubmitted}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </Grid>

                    <Grid item xs={10} lg={8} sm={10} xl={8}>

                        <Typography
                            variant="h3"
                            sx={{textAlign: "center", fontWeight: "bold",textShadow: "3px 3px 4px silver",}}
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

