import React, { useState, useEffect } from 'react';
import {
  Box, Button, useTheme, Card, CardContent, IconButton,
  Pagination, Tooltip, Menu, MenuItem, Grid, CircularProgress
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
import { OBJECT_API_INVENTORY, GET_INVENTORY, DELETE_INVENTORY } from "../api/endUrls";
import ErrorComponent from '../Errors';

const InventoriesMobile = () => {

  const OBJECT_API = OBJECT_API_INVENTORY
  const URL_getRecords = GET_INVENTORY
  const URL_deleteRecords = DELETE_INVENTORY


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState()
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

  const [showDelete, setShowDelete] = useState(false)
  const [selectedRecordIds, setSelectedRecordIds] = useState()
  const [selectedRecordDatas, setSelectedRecordDatas] = useState()

  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(0);
  const [fetchPermissionloading, setFetchPermissionLoading] = useState(true);
  const [permissionValues, setPermissionValues] = useState({})
  const userRoleDpt = getLoginUserRoleDept(OBJECT_API)
  console.log(userRoleDpt, "userRoleDpt")

  useEffect(() => {
    fetchRecords();
    fetchObjectPermissions();
  }, []);

  const fetchRecords = () => {
    setFetchLoading(true);
    try {
      RequestServer(apiMethods.get, URL_getRecords)
        .then((res) => {
          console.log(res, "api res index page")
          if (res.success) {
            setRecords(res.data)
            setFetchLoading(false)
            setFetchError(null)
            setNoOfPages(Math.ceil(res.data.length / itemsPerPage))
          }
          else {
            setRecords([])
            setFetchLoading(false)
            setFetchError(res.error.message)
          }
        })
        .catch((err) => {
          setFetchError(err.message)
          setFetchLoading(false)
        })
    }
    catch (error) {
      setFetchError(error.message)
      setFetchLoading(false)
    }
  }

  const fetchObjectPermissions = () => {
    if (userRoleDpt) {
      apiCheckObjectPermission(userRoleDpt)
        .then(res => {
          console.log(res, "api res apiCheckPermission")
          setPermissionValues(res[0].permissions)
        })
        .catch(err => {
          console.log(err, "error in apiCheckPermission")
          setPermissionValues({})
        })
        .finally(() => {
          setFetchPermissionLoading(false)
        })
    }
  }

  const handleAddRecord = () => {
    navigate("/new-inventories", { state: { record: {} } })
  };

  const handleCardEdit = (row) => {
    console.log('selected record', row);
    const item = row;
    navigate(`/inventoryDetailPage/${item._id}`, { state: { record: { item } } })
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
      row.forEach(element => {
        onebyoneDelete(element)
      });
    }
    else {
      onebyoneDelete(row._id)
    }
  }

  const onebyoneDelete = (row) => {

    console.log('one by one Delete row', row)

    RequestServer(apiMethods.delete, URL_deleteRecords + row)
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
          fetchPermissionloading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="200px"
            >
              <CircularProgress />
            </Box>
          ) : fetchError ? (<ErrorComponent error={fetchError} retry={fetchRecords} />) : (
            permissionValues.read && (
              <>
                <Header
                  title="Inventories"
                  subtitle="List of Inventory"
                />
                {
                  permissionValues.create &&
                  <div className='btn-test'>
                    <Button variant="contained" color="info" onClick={handleAddRecord}>
                      New
                    </Button>
                  </div>
                }

                <Card dense compoent="span" sx={{ bgcolor: "white" }}>
                  {records.length > 0 ?
                    records
                      .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                      .map((item) => {
                        return (
                          <div>
                            <CardContent sx={{ bgcolor: "aliceblue", m: "20px" }}>
                              <div
                                key={item._id}
                              >
                                <Grid container spacing={2}>
                                  <Grid item xs={10} md={10}>
                                    <div>PropertyName : {item.propertyName} </div>
                                    <div>projectName :{item.projectName} </div>
                                    <div>Status : {item.status} </div>
                                    <div>Type : {item.type} </div>
                                    <div>City : {item.city} </div>
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
                }
              </>
            ))
        }
      </Box>
    </>
  )
}

export default InventoriesMobile;
