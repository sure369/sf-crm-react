import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Box, Button, Typography, Modal
  , IconButton, Grid, Accordion, AccordionSummary, AccordionDetails, 
  Pagination, Menu, MenuItem
} from "@mui/material";
import axios from 'axios'
import SimpleSnackbar from "../toast/SimpleSnackbar";
import ModalOppTask from "../tasks/ModalOppTask";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ModalOppInventory from "../OppInventory/ModalOppInventory";
import { DataGrid, GridToolbar,
  gridPageCountSelector,gridPageSelector,
  useGridApiContext,useGridSelector} from "@mui/x-data-grid";


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

const OpportunityRelatedItems = ({ item }) => {

  
  const taskDeleteURL = "http://localhost:4000/api/deleteTask?code=";
  const inventoryDeleteURL = "http://localhost:4000/api/deleteInventory?code=";



  const navigate = useNavigate();
  const location = useLocation();
  const [relatedTask, setRelatedTask] = useState([]);
  const [relatedInventory, setRelatedInventory] = useState([]);

  const [opportunityRecordId, setOpportunityRecordId] = useState()

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [alertSeverity, setAlertSeverity] = useState();

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskItemsPerPage, setTaskItemsPerPage] = useState(2);
  const [taskPerPage, setTaskPerPage] = useState(1);
  const [taskNoOfPages, setTaskNoOfPages] = useState(0);


  const[jnOppInvenModalOpen,setJnOppInvenModalOpen] =useState(false)
  const [inventoryItemsPerPage, setInventorytemsPerPage] = useState(2);
  const [inventoryPerPage, setInventoryPerPage] = useState(1);
  const [inventoryNoOfPages, setInventoryNoOfPages] = useState(0);


  useEffect(() => {
    console.log('inside useEffect', location.state.record.item);
    setOpportunityRecordId(location.state.record.item._id)
    getTasksbyOppId(location.state.record.item._id)
    getInventorybyOppId(location.state.record.item._id)

  }, [])

  const getTasksbyOppId = (recId) => {
    const urlTask = "http://localhost:4000/api/getTaskbyOpportunityId?searchId=";
    axios.post(urlTask + recId)
      .then((res) => {
        console.log('response getTasksbyOppId fetch', res);
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
        console.log('error getTasksbyOppId fetch', error)
      })

  }

  const getInventorybyOppId =(leadsId) =>{

    const urlOpp = "http://localhost:4000/api/getInventoriesbyOppid?searchId=";
    
    console.log('inside get Inventory by opp id');
    
    axios.post(urlOpp + leadsId)
      .then((res) => {
        console.log('response getInventorybyOppId ', res.data);
        if (res.data.length > 0) {
          setRelatedInventory(res.data);
          setInventoryNoOfPages(Math.ceil(res.data.length / inventoryItemsPerPage));
          setInventoryPerPage(1)
        }
        else {
          setRelatedInventory([]);
        }
      })
      .catch((error) => {
        console.log('error getInventorybyOppId fetch', error)
      })
  }


  const handleTaskModalOpen = () => {

    setTaskModalOpen(true);
  }
  const handleTaskModalClose = () => {

    setTaskModalOpen(false);
  }

  const handleJunctionOppInvModalClose = () => {
    setJnOppInvenModalOpen(false);
  }


  const handleJnInventoryModalOpen =()=>{
    setJnOppInvenModalOpen(true)
  }

  const handleTaskCardEdit = (row) => {

    console.log('selected record', row);
    const item = row;
   navigate("/taskDetailPage", { state: { record: { item } } })
  };

  const handleTaskCardDelete = (row) => {

    console.log('req delete rec', row);
    console.log('req delete rec id', row._id);

    axios.post(taskDeleteURL + row._id)
      .then((res) => {
        console.log('api delete response', res);
        console.log('inside delete response opportunityRecordId', opportunityRecordId)
        getTasksbyOppId(opportunityRecordId)
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

  const handleOnCellClick = (e, row) => {
    // setFinalClickInfo(e);
    const item = row;
    console.log('item',item);
    navigate("/inventoryDetailPage", { state: { record: { item } } })
  };


  const onHandleDelete = (e, row) => {
    e.stopPropagation();
    console.log('req delete rec', row);
    console.log('req delete rec id', row._id);

    axios.post(inventoryDeleteURL + row._id)
    .then((res) => {
      console.log('api delete response', res);
      console.log('inside delete response opportunityRecordId', opportunityRecordId)
      getInventorybyOppId(opportunityRecordId)
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


   
  };

  const handleInventoryCardEdit = (row) => {

    console.log('Inventory selected edit record', row);

    const item = row

  navigate("/inventoryDetailPage", { state: { record: { item } } })
  };

  const handleInventoryCardDelete =(row) =>{

    console.log('req opp delete rec',row)
    axios.post(inventoryDeleteURL + row._id)
    .then((res) => {
      console.log('api delete response', res);
      console.log('inside delete response opportunityRecordId', opportunityRecordId)
      getInventorybyOppId(opportunityRecordId)
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
  const handleChangeInventoryPage = (event, value) => {
    setInventoryPerPage(value);
  };

  

  // Task menu dropdown strart 
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuSelectRec, setMenuSelectRec] = useState()
  const [menuOpen, setMenuOpen] = useState();

  const handleTaskMoreMenuClick = (item, event) => {
    setMenuSelectRec(item)
    setAnchorEl(event.currentTarget);
    setMenuOpen(true)

  };
  const handleTaskMoreMenuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false)
  };
  // menu dropdown end

  // Inventory menu dropdown strart //menu pass rec
  const [inventoryAnchorEl, setInventoryAnchorEl] = useState(null);
  const [inventoryMenuSelectRec, setInventoryMenuSelectRec] = useState()
  const [inventoryMenuOpen, setInventoryMenuOpen] = useState();

  const handleOppMoreMenuClick = (item, event) => {
    console.log('handle OPP MoreMenu Click  item',item)
    
    setInventoryMenuSelectRec(item)
    setInventoryAnchorEl(event.currentTarget);
    setInventoryMenuOpen(true)

  };
  const handleInventoryMoreMenuClose = () => {
    setInventoryAnchorEl(null);
    setInventoryMenuOpen(false)      
    setInventoryMenuSelectRec()
  };
  // menu dropdown end


  // DATA GRID TABLE PAGINATION
function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

const columns = [
  {
    field: "projectName", headerName: "Project Name",
    headerAlign: 'center', align: 'center', flex: 1, 
  },
  {
    field: "propertyName", headerName: "Property Name",
    headerAlign: 'center', align: 'center', flex: 1,
  },
  {
    field: "status", headerName: "Status",
    headerAlign: 'center', align: 'center', flex: 1,
  },
  {
    field: 'actions', headerName: 'Actions',
    headerAlign: 'center', align: 'center', flex: 1, width: 400,
    renderCell: (params) => {
      return (
        <>
          <IconButton style={{ padding: '20px' }}>
            <EditIcon onClick={(e) => handleOnCellClick(e, params.row)} />
          </IconButton>
          <IconButton style={{ padding: '20px' }}>
            <DeleteIcon onClick={(e) => onHandleDelete(e, params.row)} />
          </IconButton>
        </>
      );
    }
  }
 
];


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
                                  <div>Date&Time :{starDateConvert} </div>
                                  <div>Description : {item.description} </div>
                                </Grid>
                                <Grid item xs={6} md={2}>

                                  <IconButton>
                                    <MoreVertIcon onClick={(event) => handleTaskMoreMenuClick(item, event)} />
                                    <Menu
                                      anchorEl={anchorEl}
                                      open={menuOpen}
                                      onClose={handleTaskMoreMenuClose}
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
          <Typography variant="h4">Inventory({relatedInventory.length}) </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          <div style={{ textAlign: "end", marginBottom: "5px" }}>
              <Button variant="contained" color="info" onClick={() => handleJnInventoryModalOpen()} >Add Inventory</Button>
            </div>
            <Card dense compoent="span" >

              {

                relatedInventory.length > 0 ?
                relatedInventory
                    .slice((inventoryPerPage - 1) * inventoryItemsPerPage, inventoryPerPage * inventoryItemsPerPage)
                    .map((item) => {  

                      return (
                        <div >

                          <CardContent sx={{ bgcolor: "aliceblue", m: "15px" }}>
                            <div
                              key={item._id}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={6} md={10}>
                                  <div>Inventory Name : {item.propertyName} </div>
                                  <div>Status : {item.status}</div>
                                  <div>Type : {item.type} </div>
                                </Grid>
                                <Grid item xs={6} md={2}>

                                  <IconButton>
                                    <MoreVertIcon onClick={(event) => handleOppMoreMenuClick(item, event)} />
                                    <Menu
                                      anchorEl={inventoryAnchorEl}
                                      open={inventoryMenuOpen}
                                      onClose={handleInventoryMoreMenuClose}
                                      anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                      }}
                                      transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                      }}
                                    >
                                      <MenuItem onClick={() => handleInventoryCardEdit(inventoryMenuSelectRec)}>Edit</MenuItem>
                                      <MenuItem onClick={() => handleInventoryCardDelete(inventoryMenuSelectRec)}>Delete</MenuItem>
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
              relatedInventory.length > 0 &&
              <Box display="flex" alignItems="center" justifyContent="center">
                <Pagination
                  count={inventoryNoOfPages}
                  page={inventoryPerPage}
                  onChange={handleChangeInventoryPage}
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

      {/* inventory table */}
      <Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography variant="h4">Inventory Table({relatedInventory.length}) </Typography>
        </AccordionSummary>
        <AccordionDetails>
       
        <div style={{ textAlign: "end", marginBottom: "5px" }}>
              <Button variant="contained" color="info" onClick={() => handleJnInventoryModalOpen()} >Add Inventory</Button>
            </div>
        <Box sx={{ height: 315, width: '100%' }}>

          <DataGrid
                      rows={relatedInventory}
                      columns={columns}
                      getRowId={(row) => row._id}
                      pageSize={4}
                      rowsPerPageOptions={[4]}
                      //  onCellClick={handleOnCellClick}
                      components={{ Pagination:CustomPagination}}
                     
                      disableColumnMenu
                      autoHeight={true}
                    />
 
    </Box>

        </AccordionDetails>
      </Accordion>


      <Modal
        open={taskModalOpen}
        onClose={handleTaskModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ModalOppTask handleModal={handleTaskModalClose} />
        </Box>
      </Modal>

    {/* Junction Opp -Inventory */}

      <Modal
        open={jnOppInvenModalOpen}
        onClose={handleJunctionOppInvModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ModalOppInventory  handleModal={handleJunctionOppInvModalClose} />
        </Box>
      </Modal>

    </>
  )

}
export default OpportunityRelatedItems
