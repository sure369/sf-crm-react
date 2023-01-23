import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Box, Button, Typography, Modal
  , IconButton, Grid, Accordion, AccordionSummary, AccordionDetails, Pagination, Menu, MenuItem
} from "@mui/material";
import axios from 'axios'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ModalAccTask from "../tasks/ModalAccTask";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Notification from '../toast/Notification';

const ModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
};

const AccountRelatedItems = ({ item }) => {

  const taskDeleteURL = "http://localhost:4000/api/deleteTask?code=";

  const navigate = useNavigate();
  const location = useLocation();
  const [relatedTask, setRelatedTask] = useState([]);

  const [accountRecordId, setAccountRecordId] = useState()
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
 
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskItemsPerPage, setTaskItemsPerPage] = useState(2);
  const [taskPerPage, setTaskPerPage] = useState(1);
  const [taskNoOfPages, setTaskNoOfPages] = useState(0);


  useEffect(() => {
    console.log('inside useEffect', location.state.record.item);
    setAccountRecordId(location.state.record.item._id)
    getTasksbyAccountId(location.state.record.item._id)
    
  }, [])


  const getTasksbyAccountId = (recId) => {
    const urlTask = "http://localhost:4000/api/getTaskbyAccountId?searchId=";
    console.log('inside getTasks record Id', recId);

    axios.post(urlTask + recId)
      .then((res) => {
        console.log('response task fetch', res);
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

  const handletaskModalOpen = () => {

    setTaskModalOpen(true);
  }
  const handleTaskModalClose = () => {

    setTaskModalOpen(false);
  }
 

  const handleTaskCardEdit = (row) => {
    console.log('selected record', row);
    const item = row;
    navigate("/taskDetailPage", { state: { record: { item } } })
  };

  const handleTaskCardDelete = (row) => {

    console.log('req delete rec', row);
    axios.post(taskDeleteURL+ row._id)
      .then((res) => {
        console.log('api delete response', res);
        getTasksbyAccountId(accountRecordId)
        setNotify({
          isOpen: true,
          message: res.data,
          type: 'success'
      })
      setMenuOpen(false)
      setTimeout(
        window.location.reload()
      )
      })
      .catch((error) => {
        console.log('api delete error', error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: 'error'
      })
      })
  };
 

  const handleChangeTaskPage = (event, value) => {
    setTaskPerPage(value);
  };

  // menu dropdown strart //menu pass rec
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuSelectRec, setMenuSelectRec] = useState()
  const [menuOpen, setMenuOpen] = useState();

  const handleTaskMoreMenuClick = (item, event) => {
    setMenuSelectRec(item)
    setAnchorEl(event.currentTarget);
    setMenuOpen(true)

  };
  const handleMoreMenuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false)
  };
  // menu dropdown end

  return (
    <>
     
     <Notification notify={notify} setNotify={setNotify} />

      <div style={{ textAlign: "center", marginBottom: "10px" }}>

        <h3> Related Items</h3>

      </div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h4">Related Task ({relatedTask.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div style={{ textAlign: "end", marginBottom: "5px" }}>
              <Button variant="contained" color="info" onClick={() => handletaskModalOpen()} >New Task</Button>
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
                                  <div>Date&Time :{starDateConvert}</div>
                                  <div>Description : {item.description} </div>
                                </Grid>
                                <Grid item xs={6} md={2}>

                                  <IconButton>
                                    <MoreVertIcon onClick={(event) => handleTaskMoreMenuClick(item, event)} />
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
     


      <Modal
        open={taskModalOpen}
        onClose={handleTaskModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <ModalAccTask handleModal={handleTaskModalClose} />
        </Box>
      </Modal>

    </>
  )

}
export default AccountRelatedItems

