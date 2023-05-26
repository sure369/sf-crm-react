import React, { useState, useEffect } from "react";
import {
  Box, Button, useTheme, IconButton, Pagination, Tooltip,
  Typography, Grid, Modal,
} from "@mui/material";
import {
  DataGrid, GridToolbar, gridPageCountSelector, gridPageSelector,
  useGridApiContext, useGridSelector,
} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ToastNotification from "../toast/ToastNotification";
import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";
import ModalFileUpload from "../dataLoader/ModalFileUpload";
import { OppIndexFilterPicklist } from "../../data/pickLists";
import ExcelDownload from '../Excel';
import { RequestServer } from "../api/HttpReq";
import '../indexCSS/muiBoxStyles.css'
import { apiMethods } from "../api/methods";
import { apiCheckObjectPermission } from '../Auth/apiCheckObjectPermission'
import { getLoginUserRoleDept } from '../Auth/userRoleDept';
import { OBJECT_API_PERMISSIONS,GET_PERMISSIONS,DELETE_PERMISSIONS } from "../api/endUrls";
import CircularProgress from '@mui/material/CircularProgress';

const PermissionSets = () => {

  const OBJECT_API = OBJECT_API_PERMISSIONS
  const URL_getRecords = GET_PERMISSIONS
  const URL_deleteRecords =DELETE_PERMISSIONS

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState()
  const [notify, setNotify] = useState({ isOpen: false, message: "", type: "", });
  //dialog
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subTitle: "", });

  const [fetchPermissionloading, setFetchPermissionLoading] = useState(true);

  const [showDelete, setShowDelete] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState();
  const [selectedRecordDatas, setSelectedRecordDatas] = useState();
  
  const [permissionValues, setPermissionValues] = useState({})
  const userRoleDpt = getLoginUserRoleDept(OBJECT_API)
  console.log(userRoleDpt, "userRoleDpt")

  useEffect(() => {
    fetchRecords();
    fetchObjectPermissions();
  }, []);

  const fetchRecords = () => {
    // RequestServer(apiMethods.get,URL_getRecords+'/access=read')
    RequestServer(apiMethods.get,URL_getRecords)
    .then((res) => {
        console.log(res, "index page res")
        if (res.success) {
          setRecords(res.data)
          setFetchError(null)
          setFetchLoading(false)
        } else {
          setRecords([])
          setFetchError(res.error.message)
          setFetchLoading(false)
        }
      })
      .catch((error) => {
        setFetchError(error.message)
        setFetchLoading(false)
      })
  };

  const fetchObjectPermissions=()=>{
    if (userRoleDpt) {
      apiCheckObjectPermission(userRoleDpt)
        .then(res => {
          console.log(res[0].permissions, "res apiCheckObjectPermission")
          setPermissionValues(res[0].permissions)
        })
        .catch(err => {
          console.log(err, "res apiCheckObjectPermission")
          setPermissionValues({})
        })
        .finally(() => {
          setFetchPermissionLoading(false)
        })
    }
  }

  const handleAddRecord = () => {
    navigate("/new-permission", { state: { record: {} } });
  };

  const handleOnCellClick = (e) => {
    console.log("selected record", e);
    const item = e.row;
    navigate(`/permissionDetailPage/${item._id}`, {
      state: { record: { item } },
    });
  };

  const onHandleDelete = (e, row) => {
    e.stopPropagation();
    console.log("req delete rec", row);
    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to delete this Record ?`,
      subTitle: "You can't undo this Operation",
      onConfirm: () => {
        onConfirmDeleteRecord(row);
      },
    });
  };
  const onConfirmDeleteRecord = (row) => {
    if (row.length) {
      console.log("if row", row);
      row.forEach((element) => {
        onebyoneDelete(element);
      });
    } else {
      console.log("else", row._id);
      onebyoneDelete(row._id);
    }
  };
  const onebyoneDelete = (row) => {
    console.log("onebyoneDelete rec id", row);

    RequestServer(apiMethods.delete,URL_deleteRecords + row)
      .then((res) => {
        if (res.success) {
          fetchRecords()
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
      field: "permissionName", headerName: "Permission Name",
      headerAlign: "center", align: "center", flex: 1,
    },
    {
      field: "department", headerName: "Department Name",
      headerAlign: "center", align: "center", flex: 1,
    },
    {
      field: "roleDetails", headerName: "Role",
      headerAlign: "center", align: "center", flex: 1,
      renderCell: (params) => {
        if (params.row.roleDetails) {
          return (
            <div className="rowitem">
              {params.row.roleDetails.roleName}
            </div>
          );
        } else {
          return <div className="rowitem">{null}</div>;
        }
      },
    },]
  if (permissionValues.delete) {
    columns.push({
      field: "actions", headerName: "Actions",
      headerAlign: "center", align: "center",
      flex: 1, width: 400,
      renderCell: (params) => {
        return (
          <>
            {!showDelete ? (
              <>
                {/* <IconButton onClick={(e) => handleOnCellClick(e, params.row)} style={{ padding: '20px', color: '#0080FF' }}>
                      <EditIcon  />
                    </IconButton> */}
                <IconButton
                  onClick={(e) => onHandleDelete(e, params.row)}
                  style={{ padding: "20px", color: "#FF3333" }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ) : (
              ""
            )}
          </>
        )
      }
    })
  }

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

      <Box m="20px">
        { fetchPermissionloading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <CircularProgress />
          </Box>
        ) : (
           permissionValues.read &&(
            <>
              <Typography
                variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ m: "0 0 5px 0" }}
              >
                {OBJECT_API}
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h5" color={colors.greenAccent[400]}>
                  List Of {OBJECT_API}
                </Typography>


                <div
                  style={{
                    display: "flex",
                    width: "250px",
                    justifyContent: "space-evenly",
                    height: '30px',
                  }}
                >

                  {showDelete ? (
                    <>
                      {
                        permissionValues.delete &&
                        <>

                          <Tooltip title="Delete Selected">
                            <IconButton>
                              <DeleteIcon
                                sx={{ color: "#FF3333" }}
                                onClick={(e) => onHandleDelete(e, selectedRecordIds)}
                              />
                            </IconButton>
                          </Tooltip>
                        </>
                      }</>
                  ) : (
                    <>
                      {
                         permissionValues.create &&
                        <>
                          <Button variant="contained" color="info" onClick={handleAddRecord}>
                            New
                          </Button>
                          <ExcelDownload data={records} filename={`OpportunityRecords`} />
                        </>
                      }

                    </>
                  )}
                </div>
              </Box>

              <Box
                m="15px 0 0 0"
                height="380px"
                className="my-mui-styles"
              >
                <DataGrid
                  rows={records}
                  columns={columns}
                  getRowId={(row) => row._id}
                  pageSize={7}
                  rowsPerPageOptions={[7]}
                  components={{
                    Pagination: CustomPagination,
                    // Toolbar: GridToolbar
                  }}
                  loading={fetchLoading}
                  getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0
                      ? "C-MuiDataGrid-row-even"
                      : "C-MuiDataGrid-row-odd"
                  }
                  checkboxSelection
                  disableSelectionOnClick
                  onSelectionModelChange={(ids) => {
                    var size = Object.keys(ids).length;
                    size > 0 ? setShowDelete(true) : setShowDelete(false);
                    console.log("checkbox selection ids", ids);
                    setSelectedRecordIds(ids);
                    const selectedIDs = new Set(ids);
                    const selectedRowRecords = records.filter((row) =>
                      selectedIDs.has(row._id.toString())
                    );
                    setSelectedRecordDatas(selectedRowRecords);
                  }}
                  onRowClick={(e) => handleOnCellClick(e)}
                />
              </Box>

            </>
           ))}
      </Box>


    </>
  );
};
export default PermissionSets;

