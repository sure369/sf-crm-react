import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Box, Button, Typography, Modal
  , IconButton, Grid, Accordion, AccordionSummary, AccordionDetails,
  Pagination, Menu, MenuItem
} from "@mui/material";
import ModalOppTask from "../tasks/ModalOppTask";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ModalOppInventory from "../OppInventory/ModalOppInventory";
import ToastNotification from "../toast/ToastNotification";
import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";
import '../recordDetailPage/Form.css'
import { RequestServer } from "../api/HttpReq";
import { apiMethods } from "../api/methods";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import { apiCheckObjectPermission } from "../Auth/apiCheckObjectPermission";
import NoAccessCard from '../NoAccess/NoAccessCard'
import { OBJECT_API_EVENT,DELETE_EVENT,GET_DEAL_RELATED_EVENT } from "../api/endUrls";


const OpportunityRelatedItems = ({ item }) => {

  const OBJECT_API_task = OBJECT_API_EVENT
  const URL_getRelatedEventRecords = GET_DEAL_RELATED_EVENT
  const URL_deleteEventRecord = DELETE_EVENT

  const navigate = useNavigate();
  const location = useLocation();
  const [relatedTask, setRelatedTask] = useState([]);

  const [opportunityRecordId, setOpportunityRecordId] = useState()
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskItemsPerPage, setTaskItemsPerPage] = useState(2);
  const [taskPerPage, setTaskPerPage] = useState(1);
  const [taskNoOfPages, setTaskNoOfPages] = useState(0);


  const [permissionValuesTask, setPermissionValuesTask] = useState({})
  const userRoleDptTask = getLoginUserRoleDept(OBJECT_API_task)
  console.log(userRoleDptTask, "userRoleDptTask")


  useEffect(() => {
    console.log('inside useEffect', location.state.record.item);
    setOpportunityRecordId(location.state.record.item._id)
    getTasksbyOppId(location.state.record.item._id)
    fetchObjectPermissions();
  }, [])

  const fetchObjectPermissions = () => {
    if (userRoleDptTask) {
      apiCheckObjectPermission(userRoleDptTask)
        .then(res => {
          console.log(res[0].permissions, " res apiCheckObjectPermission task")
          setPermissionValuesTask(res[0].permissions)
        })
        .catch(err => {
          console.log(err, " error apiCheckObjectPermission task")
          setPermissionValuesTask({})
        })
    }
  }

  const getTasksbyOppId = (recId) => {

    RequestServer(apiMethods.get, URL_getRelatedEventRecords + recId)
      .then((res) => {
        if (res.success) {
          setRelatedTask(res.data);
          setTaskNoOfPages(Math.ceil(res.data.length / taskItemsPerPage));
          setTaskPerPage(1)
        } else {
          setRelatedTask([])
        }
      })
      .catch((err) => {
        console.log('error task fetch', err)
      })

  }

  const handleTaskModalOpen = () => {
    setTaskModalOpen(true);
  }
  const handleTaskModalClose = () => {
    setTaskModalOpen(false);
    getTasksbyOppId(opportunityRecordId)
  }


  const handleTaskCardEdit = (row) => {
    console.log('selected record', row);
    const item = row;
    navigate(`/taskDetailPage/${item._id}`, { state: { record: { item } } })
  };

  const handleReqTaskCardDelete = (e, row) => {
    e.stopPropagation();
    console.log('inside handleTaskCardDelete fn')
    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to delete this Record ?`,
      subTitle: "You can't undo this Operation",
      onConfirm: () => { onConfirmTaskCardDelete(row) }
    })
  }

  const onConfirmTaskCardDelete = (row) => {

    console.log('req delete rec', row);
    console.log('req delete rec id', row._id);
    RequestServer(apiMethods.delete, URL_deleteEventRecord + row._id)
      .then((res) => {
        if (res.success) {
          getTasksbyOppId(opportunityRecordId)
          setMenuOpen(false)
          setNotify({
            isOpen: true,
            message: res.data,
            type: 'success'
          })
        }
        else {
          console.log(res, "error in then")
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: 'error'
          })
          getTasksbyOppId(opportunityRecordId)
          setMenuOpen(false)
        }
      })
      .catch((error) => {
        console.log('api delete error', error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: 'error'
        })
      })
      .finally(() => {
        setConfirmDialog({
          ...confirmDialog,
          isOpen: false
        })
      })
  };

  const handleChangeTaskPage = (event, value) => {
    setTaskPerPage(value);
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

  return (
    <>

      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} moreModalClose={handleTaskMoreMenuClose} />

      <div style={{ textAlign: "center", marginBottom: "10px" }}>

        <h2> Related Items</h2>

      </div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h4">Event Log ({relatedTask.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {
              permissionValuesTask.read ?
                <>
                  <div style={{ textAlign: "end", marginBottom: "5px" }}>
                    {
                      permissionValuesTask.create &&
                      <Button variant="contained" color="info" onClick={() => handleTaskModalOpen()} >New Event</Button>
                    }
                  </div>
                  <Card dense compoent="span" >
                    {
                      relatedTask.length > 0 ?
                        relatedTask
                          .slice((taskPerPage - 1) * taskItemsPerPage, taskPerPage * taskItemsPerPage)
                          .map((item) => {

                            let starDateConvert;
                            if (item.StartDate) {
                              starDateConvert = new Date(item.StartDate).getUTCFullYear()
                                + '-' + ('0' + (new Date(item.StartDate).getUTCMonth() + 1)).slice(-2)
                                + '-' + ('0' + (new Date(item.StartDate).getUTCDate())).slice(-2) || ''
                            }

                            return (
                              <div >
                                <CardContent sx={{ bgcolor: "aliceblue", m: "15px" }}>
                                  <div
                                    key={item._id}
                                  >
                                    <Grid container spacing={2}>
                                      <Grid item xs={10} md={10}>
                                        <div>Subject : {item.subject} </div>
                                        <div>Date&Time :{starDateConvert} </div>
                                        <div>Description : {item.description} </div>
                                      </Grid>
                                      <Grid item xs={2} md={2}>

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
                                            {
                                              permissionValuesTask.edit ?
                                                <MenuItem onClick={() => handleTaskCardEdit(menuSelectRec)}>Edit</MenuItem>
                                                :
                                                <MenuItem onClick={() => handleTaskCardEdit(menuSelectRec)}>View</MenuItem>
                                            }
                                            {
                                              permissionValuesTask.delete &&
                                              <MenuItem onClick={(e) => handleReqTaskCardDelete(e, menuSelectRec)}>Delete</MenuItem>
                                            }
                                          </Menu>
                                        </IconButton>
                                      </Grid>
                                    </Grid>
                                  </div>
                                </CardContent>
                              </div>
                            );
                          })
                        : null
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
                </>
                : <NoAccessCard />
            }
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Modal
        open={taskModalOpen}
        onClose={handleTaskModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: "blur(1px)" }}
      >
        <div className="modal">
          <ModalOppTask handleModal={handleTaskModalClose} />
        </div>
      </Modal>
    </>
  )

}
export default OpportunityRelatedItems

