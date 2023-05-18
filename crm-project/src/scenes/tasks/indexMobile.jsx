import React, { useState, useEffect } from 'react';
import {
  Box, Button, useTheme, Card, CardContent, IconButton,
  Pagination, Tooltip, Grid, MenuItem, Menu
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import ToastNotification from '../toast/ToastNotification';
import DeleteConfirmDialog from '../toast/DeleteConfirmDialog';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { RequestServer } from '../api/HttpReq';
import { apiMethods } from '../api/methods';
import { apiCheckObjectPermission } from '../Auth/apiCheckObjectPermission';
import { getLoginUserRoleDept } from '../Auth/userRoleDept';

const TaskMobile = () => {

  const OBJECT_API = 'Task'
  const urlDelete = `/deleteTask?code=`;
  const urlTask = `/Task`;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState()
  const [fetchLoading, setFetchLoading] = useState(true);
  // notification
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  //dialog
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

  const [showDelete, setShowDelete] = useState(false)
  const [selectedRecordIds, setSelectedRecordIds] = useState()
  const [selectedRecordDatas, setSelectedRecordDatas] = useState()

  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(0);

  const [permissionValues, setPermissionValues] = useState({})
  const userRoleDpt = getLoginUserRoleDept(OBJECT_API)
  console.log(userRoleDpt, "userRoleDpt")

  useEffect(() => {
    fetchRecords();
    fetchObjectPermissions();

  }, []
  );

  const fetchRecords = () => {
    RequestServer(apiMethods.post, urlTask)
      .then((res) => {
        console.log(res, "index page res")
        if (res.success) {
          setRecords(res.data)
          setFetchLoading(false)
          setFetchError(null)
          setNoOfPages(Math.ceil(res.data.length / itemsPerPage));
        }
        else {
          setRecords([])
          setFetchError(res.error.message)
          setFetchLoading(false)
        }
      })
      .catch((err) => {
        setFetchError(err.message)
        setFetchLoading(false)
      })
  }

  const fetchObjectPermissions = () => {
    if (userRoleDpt) {
      apiCheckObjectPermission(userRoleDpt)
        .then(res => {
          console.log(res, "api res apiCheckPermission")
          setPermissionValues(res[0].permissions)
        })
        .catch(err => {
          setPermissionValues({})
        })
    }
  }

  const handleAddRecord = () => {
    navigate("/new-task", { state: { record: {} } })
  };

  const handleCardEdit = (row) => {
    console.log('selected record', row);
    const item = row;
    navigate(`/taskDetailPage/${item._id}`, { state: { record: { item } } })
  };

  const handleCardDelete = (e, row) => {
    e.stopPropagation();
    console.log('req delete rec', row);
    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to delete this Record ?`,
      subTitle: "You can't undo this Operation",
      onConfirm: () => { onConfirmDeleteRecord(row) }
    })
  }

  const onConfirmDeleteRecord = (row) => {
    if (row.length) {
      console.log('if row', row);
      row.forEach(element => {
        onebyoneDelete(element)
      });
    }
    else {
      console.log('else', row._id);
      onebyoneDelete(row._id)
    }
  }

  const onebyoneDelete = (row) => {
    console.log('onebyoneDelete rec id', row)

    RequestServer(apiMethods.post, urlDelete + row)
      .then((res) => {
        if (res.success) {
          fetchRecords()
          setNotify({
            isOpen: true,
            message: res.data,
            type: 'success'
          })
          setMenuOpen(false)
        }
        else {
          console.log(res, "error in then")
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: 'error'
          })
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

  const handleChangePage = (event, value) => {
    setPage(value);
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
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} moreModalClose={handleMoreMenuClose} />

      <Box m="20px">
        {
          permissionValues.read ?
            <>
              <Header
                title="Tasks"
                subtitle="List of Task"
              />

              <div className='btn-test'>
                {
                  permissionValues.create &&
                  <Button variant="contained" color="info" onClick={handleAddRecord}>
                    New
                  </Button>
                }
              </div>

              <Card dense compoent="span" sx={{ bgcolor: "white" }}>
                {records.length > 0 ?
                  records
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((item) => {
                      let starDateConvert
                      if (item.StartDate) {
                        starDateConvert = new Date(item.StartDate).getUTCFullYear()
                          + '-' + ('0' + (new Date(item.StartDate).getUTCMonth() + 1)).slice(-2)
                          + '-' + ('0' + (new Date(item.StartDate).getUTCDate())).slice(-2) || ''
                      }
                      let related;
                      if (item.object === 'Account' && item.Accountdetails.length > 0) {
                        related = item.Accountdetails[0].accountName
                      }
                      else if (item.object === 'Lead' && item.Leaddetails.length > 0) {
                        related = item.Leaddetails[0].fullName
                      }
                      else if (item.object === 'Opportunity' && item.Opportunitydetails.length > 0) {
                        related = item.Opportunitydetails[0].opportunityName
                      }


                      return (
                        <div>
                          <CardContent sx={{ bgcolor: "aliceblue", m: "20px" }}>
                            <div
                              key={item._id}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={10} md={10}>
                                  <div>Subject : {item.subject} </div>
                                  <div>Object :{item.object} </div>
                                  <div>Related Rec: {related}</div>
                                  <div>Date : {starDateConvert} </div>
                                </Grid>
                                <Grid item xs={2} md={2}>
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
                                      {
                                        permissionValues.edit ?
                                          <MenuItem onClick={() => handleCardEdit(menuSelectRec)}>Edit</MenuItem>
                                          :
                                          <MenuItem onClick={() => handleCardEdit(menuSelectRec)}>View</MenuItem>
                                      }
                                      {
                                        permissionValues.delete &&
                                        <MenuItem onClick={(e) => handleCardDelete(e, menuSelectRec)}>Delete</MenuItem>
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
                  :
                  <>
                    <CardContent sx={{ bgcolor: "aliceblue", m: "20px" }}>
                      <div>No Records Found</div>
                    </CardContent>
                  </>
                }
              </Card>
              {records.length > 0 &&
                <Box
                  sx={{
                    margin: "auto",
                    width: "fit-content",
                    alignItems: "center",
                    // justifyContent:'space-between'
                  }}>
                  <Pagination
                    count={noOfPages}
                    page={page}
                    onChange={handleChangePage}
                    defaultPage={1}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    sx={{ justifyContent: 'center' }}
                  />
                </Box>
              }</>
            : null
        }
      </Box>
    </>
  )
}
export default TaskMobile;
