import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Box, Button, Typography, Modal
  , IconButton, Grid, Accordion, AccordionSummary, AccordionDetails, Pagination, Menu, MenuItem
} from "@mui/material";
import axios from 'axios'
import SimpleSnackbar from "../toast/SimpleSnackbar";
import ModalOppTask from "../tasks/ModalOppTask";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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

const InventoryRelatedItems = ({ item }) => {

  
  const taskDeleteURL = "http://localhost:4000/api/deleteTask?code=";
  const inventoryDeleteURL = "http://localhost:4000/api/deleteInventory?code=";



  const navigate = useNavigate();
  const location = useLocation();

  const [realtedOpportunity, setRealtedOpportunity] = useState([]);

  const [inventoryItemsPerPage, setInventorytemsPerPage] = useState(2);
  const [inventoryPerPage, setInventoryPerPage] = useState(1);
  const [inventoryNoOfPages, setInventoryNoOfPages] = useState(0);


  useEffect(() => {
    console.log('inside useEffect', location.state.record.item);
    console.log('inventory id',location.state.record.item._id);
    // setRealtedOpportunity(location.state.record.item._id)
    getOpportunitiesbyInvId(location.state.record.item._id)

  }, [])

  const getOpportunitiesbyInvId = (recId) => {
    const urlTask = "http://localhost:4000/api/getOpportunitiesbyInvid?searchId=";
    axios.post(urlTask + recId)
      .then((res) => {
        console.log('response getOpportunitiesbyInvId fetch', res);
        if (res.data.length > 0) {
            setRealtedOpportunity(res.data);
        //   setTaskNoOfPages(Math.ceil(res.data.length / taskItemsPerPage));
        //   setTaskPerPage(1)
        }
        else {
        //   setRelatedTask([]);
        }
      })
      .catch((error) => {
        console.log('error getTasksbyOppId fetch', error)
      })

  }




  const handleTaskCardEdit = (row) => {

    console.log('selected record', row);
    const item = row;
    // navigate("/taskDetailPage", { state: { record: { item } } })
  };

  const handleTaskCardDelete = (row) => {

    console.log('req delete rec', row);
    console.log('req delete rec id', row._id);

    // axios.post(taskDeleteURL + row._id)
    //   .then((res) => {
    //     console.log('api delete response', res);
    //     console.log('inside delete response opportunityRecordId', opportunityRecordId)
    //     getTasksbyOppId(opportunityRecordId)
    //     setShowAlert(true)
    //     setAlertMessage(res.data)
    //     setAlertSeverity('success')
    //     setMenuOpen(false)
    //     setTimeout(
    //       window.location.reload()
    //     )
    //   })
    //   .catch((error) => {
    //     console.log('api delete error', error);
    //     setShowAlert(true)
    //     setAlertMessage(error.message)
    //     setAlertSeverity('error')

    //   })
  };

  const handleInventoryCardEdit = (row) => {

    console.log('Inventory selected edit record', row);

    const item = row

  navigate("/inventoryDetailPage", { state: { record: { item } } })
  };

  const handleInventoryCardDelete =(row) =>{

    console.log('req opp delete rec',row)
    // axios.post(inventoryDeleteURL + row._id)
    // .then((res) => {
    //   console.log('api delete response', res);
    //   console.log('inside delete response opportunityRecordId', opportunityRecordId)
    //   getInventorybyOppId(opportunityRecordId)
    //   setShowAlert(true)
    //   setAlertMessage(res.data)
    //   setAlertSeverity('success')
    //   setMenuOpen(false)
    // })
    // .catch((error) => {
    //   console.log('api delete error', error);
    //   setShowAlert(true)
    //   setAlertMessage(error.message)
    //   setAlertSeverity('error')

    // })

  }

  const toastCloseCallback = () => {
    // setShowAlert(false)

  }

  const handleChangeTaskPage = (event, value) => {
    // setTaskPerPage(value);
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

  return (
    <>
      
      <div style={{ textAlign: "center", marginBottom: "10px" }}>

        <h3> Related Items</h3>

      </div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h4">Opportunity ({realtedOpportunity.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          

          </Typography>
        </AccordionDetails>
      </Accordion>
     
    </>
  )

}
export default InventoryRelatedItems

