import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Box, Button, Typography, Modal
  , IconButton, Grid, Accordion, AccordionSummary, AccordionDetails, Pagination, Menu, MenuItem
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios'
import ModalLeadTask from "../tasks/ModalLeadTask";
import SimpleSnackbar from "../toast/SimpleSnackbar";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ModalLeadOpportunity from "../opportunities/ModalLeadOpp";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
};

const LeadRelatedItems = ({ item }) => {

  const taskDeleteURL = "http://localhost:4000/api/deleteTask?code=";
  const opportunityDeleteURL = "http://localhost:4000/api/deleteOpportunity?code=";


  const navigate = useNavigate();
  const location = useLocation();
  const [relatedTask, setRelatedTask] = useState([]);
  const [relatedOpportunity, setRelatedOpportunity] = useState([]);

  const [leadRecordId, setLeadRecordId] = useState()

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [alertSeverity, setAlertSeverity] = useState();

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskItemsPerPage, setTaskItemsPerPage] = useState(2);
  const [taskPerPage, setTaskPerPage] = useState(1);
  const [taskNoOfPages, setTaskNoOfPages] = useState(0);

  const [opportunityModalOpen, setOpportunityModalOpen] = useState(false);
  const [opportunityItemsPerPage, setOpportunityItemsPerPage] = useState(2);
  const [opportunityPerPage, setOpportunityPerPage] = useState(1);
  const [opportunityNoOfPages, setOpportunityNoOfPages] = useState(0);

  // const[starDateConvert,setStarDateConvert] =useState(null);

  useEffect(() => {
    console.log('inside useEffect', location.state.record.item);
    setLeadRecordId(location.state.record.item._id)
    getTasksbyLeadId(location.state.record.item._id)
    getOpportunitybyLeadId(location.state.record.item._id)
  }, [])

  const getTasksbyLeadId = (leadsId) => {
    
    console.log('lead id',leadsId);
    const urlTask = "http://localhost:4000/api/getTaskbyLeadId?searchId=";
    axios.post(urlTask + leadsId)
      .then((res) => {
        console.log('response task fetch', res.data);
        if (res.data.length > 0) {
          setRelatedTask(res.data);
          setTaskNoOfPages(Math.ceil(res.data.length / taskItemsPerPage));
          setTaskPerPage(1)
        }
        else {
          setRelatedTask([]);
        }
      })
      .catch((error) => {
        console.log('error task fetch', error)
      })
  }

  const getOpportunitybyLeadId =(leadsId) =>{

    const urlOpp = "http://localhost:4000/api/getLeadsbyOppid?searchId=";
    axios.post(urlOpp + leadsId)
      .then((res) => {
        console.log('response opportunity fetch', res.data);
        if (res.data.length > 0) {
          setRelatedOpportunity(res.data);
          setOpportunityNoOfPages(Math.ceil(res.data.length / opportunityItemsPerPage));
          setOpportunityPerPage(1)
        }
        else {
          setRelatedOpportunity([]);
        }
      })
      .catch((error) => {
        console.log('error opportunity fetch', error)
      })
  }

  const handleTaskModalOpen = () => {

    setTaskModalOpen(true);
  }
  const handleTaskModalClose = () => {

    setTaskModalOpen(false);
  }

  const handleOpportunityModalOpen =() =>{
    setOpportunityModalOpen(true)
  }
  const handleOpportunityModalClose = () => {
    setOpportunityModalOpen(false);
  }

  const handleTaskCardEdit = (row) => {

    console.log('handleTaskCardEdit')
    console.log('selected edit record', row);
    const item = row;
    navigate("/taskDetailPage", { state: { record: { item } } })
  };

  const handleTaskCardDelete = (row) => {

    console.log('req delete rec', row);
    // console.log('req delete rec id',row._id);

    axios.post(taskDeleteURL + row._id)
      .then((res) => {
        console.log('api delete response', res);
        console.log('inside delete response leadRecordId', leadRecordId)
        getTasksbyLeadId(leadRecordId)
        setShowAlert(true)
        setAlertMessage(res.data)
        setAlertSeverity('success')
        setMenuOpen(false)
        setTimeout(
          window.location.reload()
        )
      })
      .catch((error) => {
        console.log('api delete error', error);
        setShowAlert(true)
        setAlertMessage(error.message)
        setAlertSeverity('error')

      })
  };

  const handleOpportunityCardEdit = (row) => {

    console.log('Opportunity selected edit record', row);

    const item = row;
   navigate("/opportunityDetailPage", { state: { record: { item } } })
  };

  const handleOpportunityCardDelete =(row) =>{

    console.log('req opp delete rec',row)
    axios.post(opportunityDeleteURL + row._id)
    .then((res) => {
      console.log('api delete response', res);
      console.log('inside delete response leadRecordId', leadRecordId)
      getOpportunitybyLeadId(leadRecordId)
      setShowAlert(true)
      setAlertMessage(res.data)
      setAlertSeverity('success')
      setMenuOpen(false)
    })
    .catch((error) => {
      console.log('api delete error', error);
      setShowAlert(true)
      setAlertMessage(error.message)
      setAlertSeverity('error')

    })

  }

  const toastCloseCallback = () => {
    setShowAlert(false)
  }

  const handleChangeTaskPage = (event, value) => {
    setTaskPerPage(value);
  };

  // menu dropdown strart //menu pass rec
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuSelectRec, setMenuSelectRec] = useState()
  const [menuOpen, setMenuOpen] = useState();

  const handleMoreMenuClick = (item, event) => {
    console.log('handleMoreMenuClick item',item)

    setMenuSelectRec(item)
    setAnchorEl(event.currentTarget);
    setMenuOpen(true)

  };
  const handleMoreMenuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false)
    setMenuSelectRec()
  };
  // menu dropdown end

    // Opp menu dropdown strart //menu pass rec
    const [oppanchorEl, setOppAnchorEl] = useState(null);
    const [oppMenuSelectRec, setOppMenuSelectRec] = useState()
    const [oppMenuOpen, setOppMenuOpen] = useState();
  
    const handleOppMoreMenuClick = (item, event) => {
      console.log('handle OPP MoreMenu Click  item',item)
      
      setOppMenuSelectRec(item)
      setOppAnchorEl(event.currentTarget);
      setOppMenuOpen(true)
  
    };
    const handleOppMoreMenuClose = () => {
      setOppAnchorEl(null);
      setOppMenuOpen(false)      
    setMenuSelectRec()
    };
    // menu dropdown end
  return (
    <>
      {
        showAlert && <SimpleSnackbar severity={alertSeverity} message={alertMessage} showAlert={showAlert} onClose={toastCloseCallback} />
      }

      <div style={{ textAlign: "center", marginBottom: "10px" }}>

        <h3> Related Items</h3>

      </div>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h4">Task ({relatedTask.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div style={{ textAlign: "end", marginBottom: "5px" }}>
              <Button variant="contained" color="info" onClick={() => handleTaskModalOpen()} >New Task</Button>
            </div>
            <Card dense compoent="span" >

              {

                relatedTask.length > 0 ?
                  relatedTask
                    .slice((taskPerPage - 1) * taskItemsPerPage, taskPerPage * taskItemsPerPage)
                    .map((item) => {  

                        let   starDateConvert = new Date(item.StartDate).getUTCFullYear()
                        + '-' +  ('0'+ (new Date(item.StartDate).getUTCMonth() + 1)).slice(-2) 
                        + '-' + ('0'+ ( new Date(item.StartDate).getUTCDate())).slice(-2)  ||''
                      


                      return (
                        <div >

                          <CardContent sx={{ bgcolor: "aliceblue", m: "15px" }}>
                            <div
                              key={item._id}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={6} md={10}>
                                  <div>Subject : {item.subject} </div>
                                  <div>Date : {starDateConvert}</div>
                                  <div>Description : {item.description} </div>
                                </Grid>
                                <Grid item xs={6} md={2}>

                                  <IconButton>
                                    <MoreVertIcon onClick={(event) => handleMoreMenuClick(item, event)} />
                                    <Menu
                                      anchorEl={anchorEl}
                                      open={menuOpen}
                                      onClose={handleMoreMenuClose}
                                      anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                      }}
                                      transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                      }}
                                    >
                                      <MenuItem onClick={() => handleTaskCardEdit(menuSelectRec)}>Edit</MenuItem>
                                      <MenuItem onClick={() => handleTaskCardDelete(menuSelectRec)}>Delete</MenuItem>
                                    </Menu>
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </div>
                          </CardContent>
                        </div>

                      );
                    })
                  : ""
              }

            </Card>
            {
              relatedTask.length > 0 &&
              <Box display="flex" alignItems="center" justifyContent="center">
                <Pagination
                  count={taskNoOfPages}
                  page={taskPerPage}
                  onChange={handleChangeTaskPage}
                  defaultPage={1}
                  color="primary"
                  size="medium"
                  showFirstButton
                  showLastButton
                />
              </Box>
            }

          </Typography>
        </AccordionDetails>
      </Accordion>
     
      <Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant="h4">Opportunity ({relatedOpportunity.length}) </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div style={{ textAlign: "end", marginBottom: "5px" }}>
              <Button variant="contained" color="info" onClick={() => handleOpportunityModalOpen()} >New Opportunity</Button>
            </div>
            <Card dense compoent="span" >

              {

                relatedOpportunity.length > 0 ?
                relatedOpportunity
                    .slice((opportunityPerPage - 1) * opportunityItemsPerPage, opportunityPerPage * opportunityItemsPerPage)
                    .map((item) => {  

                      return (
                        <div >

                          <CardContent sx={{ bgcolor: "aliceblue", m: "15px" }}>
                            <div
                              key={item._id}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={6} md={10}>
                                  <div>opportunity Name : {item.opportunityName} </div>
                                  <div>stage : {item.stage}</div>
                                  <div>amount : {item.amount} </div>
                                </Grid>
                                <Grid item xs={6} md={2}>

                                  <IconButton>
                                    <MoreVertIcon onClick={(event) => handleOppMoreMenuClick(item, event)} />
                                    <Menu
                                      anchorEl={oppanchorEl}
                                      open={oppMenuOpen}
                                      onClose={handleOppMoreMenuClose}
                                      anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                      }}
                                      transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                      }}
                                    >
                                      <MenuItem onClick={() => handleOpportunityCardEdit(oppMenuSelectRec)}>Edit</MenuItem>
                                      <MenuItem onClick={() => handleOpportunityCardDelete(oppMenuSelectRec)}>Delete</MenuItem>
                                    </Menu>
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </div>
                          </CardContent>
                        </div>

                      );
                    })
                  : ""
              }

            </Card>
            {
              relatedTask.length > 0 &&
              <Box display="flex" alignItems="center" justifyContent="center">
                <Pagination
                  count={taskNoOfPages}
                  page={taskPerPage}
                  onChange={handleChangeTaskPage}
                  defaultPage={1}
                  color="primary"
                  size="medium"
                  showFirstButton
                  showLastButton
                />
              </Box>
            }
          </Typography>
        </AccordionDetails>
      </Accordion>

    {/* modal for task */}
      <Modal
        open={taskModalOpen}
        onClose={handleTaskModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* <TaskDetailPage handleModal={handleTaskModalClose} showModel={true}/> */}
          <ModalLeadTask handleModal={handleTaskModalClose} />
        </Box>
      </Modal>
 {/* modal for Opportunity */}
      <Modal
        open={opportunityModalOpen}
        onClose={handleOpportunityModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* <TaskDetailPage handleModal={handleTaskModalClose} showModel={true}/> */}
          <ModalLeadOpportunity handleModal={handleOpportunityModalClose} />
        </Box>
      </Modal>

    </>
  )

}
export default LeadRelatedItems

