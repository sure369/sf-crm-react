import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Button, useTheme, IconButton, Pagination,
  Tooltip, Grid, Modal, Typography,
} from "@mui/material";
import {
  DataGrid, GridToolbar, gridPageCountSelector,
  gridPageSelector, useGridApiContext, useGridSelector,
} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ToastNotification from "../toast/ToastNotification";
import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";
import ModalFileUpload from "../dataLoader/ModalFileUpload";
import { OppIndexFilterPicklist } from "../../data/pickLists";
import ExcelDownload from "../Excel";
import { RequestServer } from "../api/HttpReq";
import "../indexCSS/muiBoxStyles.css";
import { apiMethods } from "../api/methods";
import { apiCheckObjectPermission } from '../Auth/apiCheckObjectPermission'
import { getLoginUserRoleDept } from '../Auth/userRoleDept';
import { OBJECT_API_DEAL ,GET_DEAL,DELETE_DEAL} from "../api/endUrls";
import CircularProgress from '@mui/material/CircularProgress';


const Opportunities = () => {

  const OBJECT_API = OBJECT_API_DEAL
  const URL_getRecords = GET_DEAL
  const URL_deleteRecords = DELETE_DEAL

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState();
  const [fetchPermissionloading, setFetchPermissionLoading] = useState(true);

  const [notify, setNotify] = useState({ isOpen: false, message: "", type: "", });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subTitle: "", });

  const [showDelete, setShowDelete] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState();
  const [selectedRecordDatas, setSelectedRecordDatas] = useState();

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [filterOpportunity, setFilterOpportunity] = useState("All");
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [permissionValues, setPermissionValues] = useState({})
  const userRoleDpt = getLoginUserRoleDept(OBJECT_API)
  console.log(userRoleDpt, "userRoleDpt")

  useEffect(() => {
    fetchRecords();
    fetchObjectPermissions();
  }, []);

  const fetchObjectPermissions = () => {
    if (userRoleDpt)
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

  const fetchRecords = () => {
    RequestServer(apiMethods.get, URL_getRecords)
      .then((res) => {
        console.log(res, "index page res");
        if (res.success) {
          setRecords(res.data);
          setFetchError(null);
          setFetchLoading(false);
        } else {
          setRecords([]);
          setFetchError(res.error.message);
          setFetchLoading(false);
        }
      })
      .catch((error) => {
        setFetchError(error.message);
        setFetchLoading(false);
      });
  };

  const totalRevenue = useMemo(() => {
    console.log("calculate total opportunity useMemo hook")
    return records.reduce((opp, record) => opp + parseInt(record.amount), 0
    )
  }, [records])

  console.log(totalRevenue, "totalRevenue")

  const handleAddRecord = () => {
    navigate("/new-opportunities", { state: { record: {} } });
  };

  const handleOnCellClick = (e) => {
    console.log("selected record", e);
    const item = e.row;
    navigate(`/opportunityDetailPage/${item._id}`, {
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

    RequestServer(apiMethods.delete, URL_deleteRecords + row)
      .then((res) => {
        if (res.success) {
          fetchRecords();
          setNotify({
            isOpen: true,
            message: res.data,
            type: "success",
          });
        } else {
          console.log(res, "error in then");
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: "error",
          });
        }
      })
      .catch((error) => {
        console.log("api delete error", error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: "error",
        });
      })
      .finally(() => {
        setConfirmDialog({
          ...confirmDialog,
          isOpen: false,
        });
      });
  };

  const handleImportModalOpen = () => {
    setImportModalOpen(true);
  };
  const handleImportModalClose = () => {
    setImportModalOpen(false);
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
      field: "opportunityName",
      headerName: "Opportunity Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "propertyName",
      headerName: "Inventory Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        if (params.row.Inventorydetails.length > 0) {
          return (
            <div className="rowitem">
              {params.row.Inventorydetails[0].propertyName}
            </div>
          );
        } else {
          return <div className="rowitem">{null}</div>;
        }
      },
    },
    {
      field: "type",
      headerName: "Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Opportunity Amount",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        const formatCurrency = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });
        return <>{formatCurrency.format(params.row.amount)}</>;
      },
    },
    {
      field: "stage",
      headerName: "Stage",
      headerAlign: "center",
      align: "center",
      flex: 1,
    }
  ]
  if (permissionValues.delete) {
    columns.push(
      {
        field: "actions",
        headerName: "Actions",
        headerAlign: "center",
        align: "center",
        flex: 1,
        width: 400,
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
              ) : (null)}
            </>
          )
        }
      }
    )
  }

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

      <Box m="20px">
        {fetchPermissionloading ? (
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
                  List Of {filterOpportunity} {OBJECT_API}
                </Typography>

                <div
                  style={{
                    display: "flex",
                    width: "250px",
                    justifyContent: "space-evenly",
                    height: "30px",
                  }}
                >
                  {showDelete ? (
                    <>
                      <div
                        style={{
                          width: "230px",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        {
                          permissionValues.delete &&
                          <Tooltip title="Delete Selected">
                            <IconButton>
                              <DeleteIcon
                                sx={{ color: "#FF3333" }}
                                onClick={(e) => onHandleDelete(e, selectedRecordIds)}
                              />
                            </IconButton>
                          </Tooltip>
                        }
                      </div>
                    </>
                  ) : (
                    <>
                      {
                        permissionValues.create &&
                        <>
                          <Button
                            variant="contained" color="secondary"
                            onClick={handleImportModalOpen} sx={{ color: "white" }}
                          >
                            Import
                          </Button>

                          <Button
                            variant="contained" color="info" onClick={handleAddRecord}>
                            New
                          </Button>
                          <ExcelDownload data={records} filename={`OpportunityRecords`} />
                        </>
                      }
                    </>
                  )}
                </div>
              </Box>

              <Box m="15px 0 0 0" height="380px" className="my-mui-styles">
                <DataGrid
                  sx={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                  }}
                  rows={filteredRecords.length > 0 ? filteredRecords : records}
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
          ))
        }
      </Box>

      <Modal
        open={importModalOpen}
        onClose={handleImportModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal">
          <ModalFileUpload object={OBJECT_API} handleModal={handleImportModalClose} />
        </div>
      </Modal>
    </>
  );
};
export default Opportunities;

