import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Box, Button, Typography, Modal
  , IconButton, Grid, Accordion, AccordionSummary, AccordionDetails, Pagination, Menu, MenuItem
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ModalLeadTask from "../tasks/ModalLeadTask";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ModalLeadOpportunity from "../opportunities/ModalLeadOpp";
import ToastNotification from '../toast/ToastNotification';
import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";
import '../recordDetailPage/Form.css'
import { RequestServer } from "../api/HttpReq";
import { apiMethods } from "../api/methods";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import { apiCheckObjectPermission } from "../Auth/apiCheckObjectPermission";
import NoAccessCard from '../NoAccess/NoAccessCard'
import {
  OBJECT_API_DEAL, OBJECT_API_EVENT,
  GET_ENQUIRY_RELATED_DEAL, GET_ENQUIRY_RELATED_EVENT,
  DELETE_EVENT, DELETE_DEAL
}
  from "../api/endUrls";

const LeadRelatedItems = ({ item }) => {


  const OBJECT_API_Deal = OBJECT_API_DEAL
  const OBJECT_API_Event = OBJECT_API_EVENT
  const URL_getRelatedDealRecords = GET_ENQUIRY_RELATED_DEAL;
  const URL_getRelatedEventRecords = GET_ENQUIRY_RELATED_EVENT;
  const URL_deleteDealRecords = DELETE_DEAL;
  const URL_deleteEventRecords = DELETE_EVENT;

  const navigate = useNavigate();
  const location = useLocation();
  const [relatedTask, setRelatedTask] = useState([]);
  const [relatedOpportunity, setRelatedOpportunity] = useState([]);

  const [leadRecordId, setLeadRecordId] = useState()
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskItemsPerPage, setTaskItemsPerPage] = useState(2);
  const [taskPerPage, setTaskPerPage] = useState(1);
  const [taskNoOfPages, setTaskNoOfPages] = useState(0);

  const [opportunityModalOpen, setOpportunityModalOpen] = useState(false);
  const [opportunityItemsPerPage, setOpportunityItemsPerPage] = useState(2);
  const [opportunityPerPage, setOpportunityPerPage] = useState(1);
  const [opportunityNoOfPages, setOpportunityNoOfPages] = useState(0);

  // const[starDateConvert,setStarDateConvert] =useState(null);

  const [permissionValuesTask, setPermissionValuesTask] = useState({})
  const [permissionValuesOpportunity, setPermissionValuesOpportunity] = useState({})

  const userRoleDptTask = getLoginUserRoleDept(OBJECT_API_Event)
  const userRoleDptOpportunity = getLoginUserRoleDept(OBJECT_API_Deal)
  console.log(userRoleDptTask, "userRoleDptTask")
  console.log(userRoleDptOpportunity, "userRoleDptOpportunity")


  useEffect(() => {
    console.log('inside useEffect', location.state.record.item);
    setLeadRecordId(location.state.record.item._id)
    getTasksbyLeadId(location.state.record.item._id)
    getOpportunitybyLeadId(location.state.record.item._id)

    fetchObjectPermissions()
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
    if (userRoleDptOpportunity)
      apiCheckObjectPermission(userRoleDptOpportunity)
        .then(res => {
          console.log(res[0].permissions, " res apiCheckObjectPermission opportunity")
          setPermissionValuesOpportunity(res[0].permissions)
        })
        .catch(err => {
          console.log(err, " error apiCheckObjectPermission opportunity")
          setPermissionValuesOpportunity({})
        })
  }

  const getTasksbyLeadId = (leadsId) => {

    console.log('lead id', leadsId);
    RequestServer(apiMethods.get, URL_getRelatedEventRecords + leadsId)
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

  const getOpportunitybyLeadId = (leadsId) => {
    RequestServer(apiMethods.get, URL_getRelatedDealRecords + leadsId)
      .then((res) => {
        if (res.success) {
          setRelatedOpportunity(res.data);
          setOpportunityNoOfPages(Math.ceil(res.data.length / opportunityItemsPerPage));
          setOpportunityPerPage(1)
        } else {
          setRelatedOpportunity([])
        }
      })
      .catch((err) => {
        console.log('error opportunity fetch', err)
      })
  }

  const handleTaskModalOpen = () => {
    setTaskModalOpen(true);
  }
  const handleTaskModalClose = () => {
    setTaskModalOpen(false);
    getTasksbyLeadId(leadRecordId)
  }

  const handleOpportunityModalOpen = () => {
    setOpportunityModalOpen(true)
  }
  const handleOpportunityModalClose = () => {
    setOpportunityModalOpen(false);
    getOpportunitybyLeadId(leadRecordId)
  }

  const handleTaskCardEdit = (row) => {
    console.log('selected edit record', row);
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
    RequestServer(apiMethods.delete, URL_deleteEventRecords + row._id)
      .then((res) => {
        if (res.success) {
          getTasksbyLeadId(leadRecordId)
          setMenuOpen(false)
          setNotify({
            isOpen: true,
            message: res.data,
            type: 'success'
          })
        }
        else {
          console.log(res, "error in then")
          getTasksbyLeadId(leadRecordId)
          setMenuOpen(false)
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: 'error'
          })
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

  const handleOpportunityCardEdit = (row) => {

    console.log('Opportunity selected edit record', row);
    const item = row;
    navigate(`/opportunityDetailPage/${item._id}`, { state: { record: { item } } })
  };

  const handleReqOpportunityCardDelete = (e, row) => {

    e.stopPropagation();
    console.log('inside handleTaskCardDelete fn')
    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to delete this Record ?`,
      subTitle: "You can't undo this Operation",
      onConfirm: () => { onConfirmOpportunityCardDelete(row) }
    })
  }

  const onConfirmOpportunityCardDelete = (row) => {

    console.log('req opp delete rec', row)
    RequestServer(apiMethods.delete, URL_deleteDealRecords + row._id)
      .then((res) => {
        if (res.success) {
          getOpportunitybyLeadId(leadRecordId)
          setOppMenuOpen(false)
          setNotify({
            isOpen: true,
            message: res.data,
            type: 'success'
          })
        }
        else {
          console.log(res, "error in then")
          getOpportunitybyLeadId(leadRecordId)
          setOppMenuOpen(false)
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: 'error'
          })
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

  }


  const handleChangeTaskPage = (event, value) => {
    setTaskPerPage(value);
  };
  const handleChangeOpportunityPage = (event, value) => {
    setOpportunityPerPage(value);
  };


  // menu dropdown strart //menu pass rec
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuSelectRec, setMenuSelectRec] = useState()
  const [menuOpen, setMenuOpen] = useState();

  const handleMoreMenuClick = (item, event) => {
    console.log('handleMoreMenuClick item', item)

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
  const [oppAnchorEl, setOppAnchorEl] = useState(null);
  const [oppMenuSelectRec, setOppMenuSelectRec] = useState()
  const [oppMenuOpen, setOppMenuOpen] = useState();

  const handleOppMoreMenuClick = (item, event) => {
    console.log('handle OPP MoreMenu Click  item', item)

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
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} moreModalClose={handleMoreMenuClose} />

      <div style={{ textAlign: "center", marginBottom: "10px" }}>

        <h3> Related Items</h3>

      </div>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h4">Event Logs ({relatedTask.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {
              permissionValuesTask.read ?
                <>
                  <div style={{ textAlign: "end", marginBottom: "5px" }}>
                    <Button variant="contained" color="info" onClick={() => handleTaskModalOpen()} >New Event</Button>
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
                                        <div>Date : {starDateConvert}</div>
                                        <div>Description : {item.description} </div>
                                      </Grid>
                                      <Grid item xs={2} md={2}>

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
                :
                <NoAccessCard />
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
            {
              permissionValuesOpportunity.read ? <>

                <div style={{ textAlign: "end", marginBottom: "5px" }}>
                  {
                    permissionValuesOpportunity.create &&
                    <Button variant="contained" color="info" onClick={() => handleOpportunityModalOpen()} >New Opportunity</Button>
                  }

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
                                    <Grid item xs={10} md={10}>
                                      <div>Opportunity Name : {item.opportunityName} </div>
                                      <div>Stage : {item.stage}</div>
                                      <div>Amount : {item.amount} </div>
                                    </Grid>
                                    <Grid item xs={2} md={2}>

                                      <IconButton>
                                        <MoreVertIcon onClick={(event) => handleOppMoreMenuClick(item, event)} />
                                        <Menu
                                          anchorEl={oppAnchorEl}
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
                                          {
                                            permissionValuesOpportunity.edit ?
                                              <MenuItem onClick={() => handleOpportunityCardEdit(oppMenuSelectRec)}>Edit</MenuItem>
                                              :
                                              <MenuItem onClick={() => handleOpportunityCardEdit(oppMenuSelectRec)}>View</MenuItem>
                                          }
                                          {
                                            permissionValuesOpportunity.delete &&
                                            <MenuItem onClick={(e) => handleReqOpportunityCardDelete(e, oppMenuSelectRec)}>Delete</MenuItem>
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
                  relatedOpportunity.length > 0 &&
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Pagination
                      count={opportunityNoOfPages}
                      page={opportunityPerPage}
                      onChange={handleChangeOpportunityPage}
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

      {/* modal for task */}
      <Modal
        open={taskModalOpen}
        onClose={handleTaskModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: "blur(2px)" }}
      >
        <div className="modal">
          <ModalLeadTask handleModal={handleTaskModalClose} />
        </div>
      </Modal>
      {/* modal for Opportunity */}
      <Modal
        open={opportunityModalOpen}
        onClose={handleOpportunityModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: "blur(2px)" }}
      >
        <div className="modal">
          <ModalLeadOpportunity handleModal={handleOpportunityModalClose} />
        </div>
      </Modal>
    </>
  )

}
export default LeadRelatedItems

