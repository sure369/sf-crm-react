import React, { useState, useEffect } from "react";
import {
  useTheme, Box, Button, IconButton, Pagination, Tooltip, Grid,
  Modal, Typography, MenuItem, FormControl, InputLabel, Select,
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
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import EmailModalPage from "../recordDetailPage/EmailModalPage";
import WhatAppModalPage from "../recordDetailPage/WhatsAppModalPage";
import ExcelDownload from "../Excel";
import { RequestServer } from "../api/HttpReq";
import "../recordDetailPage/Form.css";
import { LeadMonthPicklist } from "../../data/pickLists";
import "../indexCSS/muiBoxStyles.css";
import { apiMethods } from "../api/methods";
import { apiCheckObjectPermission } from '../Auth/apiCheckObjectPermission'
import { getLoginUserRoleDept } from '../Auth/userRoleDept';


const Leads = () => {

  const OBJECT_API = 'Lead'
  const urlLead = `/leads`;
  const urlSearchLead = `/leads?`;
  const urlDelete = `/deleteLead?code=`;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [filteredRecord, setFilteredRecord] = useState([]);
  const [fetchError, setFetchError] = useState();
  const [fetchLoading, setFetchLoading] = useState(true);

  const [notify, setNotify] = useState({ isOpen: false, message: "", type: "", });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subTitle: "", });

  const [showDelete, setShowDelete] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState();
  const [selectedRecordDatas, setSelectedRecordDatas] = useState();

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const [filterMonth, setFilterMonth] = useState();

  const [permissionValues, setPermissionValues] = useState({})
  const userRoleDpt = getLoginUserRoleDept(OBJECT_API)
  console.log(userRoleDpt, "userRoleDpt")

  useEffect(() => {
    fetchRecords();
    fetchObjectPermissions();

  }, []);

  const fetchRecords = () => {
    RequestServer(apiMethods.post, urlLead)
      .then((res) => {
        console.log(res, "index page res");
        if (res.success) {
          setRecords(res.data);
          setFilteredRecord(res.data);
          setFetchLoading(false);
          setFetchError(null);
        } else {
          setRecords([]);
          setFetchError(res.error.message);
          setFetchLoading(false);
        }
      })
      .catch((err) => {
        setFetchError(err.message);
        setFetchLoading(false);
      });
  };

  const fetchObjectPermissions = () => {
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
    }
  }

  const handleAddRecord = () => {
    navigate("/new-leads", { state: { record: {} } });
  };

  const handleOnCellClick = (e) => {
    console.log("selected record", e);
    const item = e.row;
    navigate(`/leadDetailPage/${item._id}`, { state: { record: { item } } });
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
    RequestServer(apiMethods.post, urlDelete + row)
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

  const handlesendEmail = () => {
    console.log("inside email");
    console.log("selectedRecordIds", selectedRecordIds);
    setEmailModalOpen(true);
  };

  const setEmailModalClose = () => {
    setEmailModalOpen(false);
  };

  const handlesendWhatsapp = () => {
    console.log("inside whats app");
    console.log("selectedRecordIds", selectedRecordIds);
    setWhatsAppModalOpen(true);
  };

  const setWhatAppModalClose = () => {
    setWhatsAppModalOpen(false);
  };

  const handleLeadFilterChange = (e) => {
    const value = e.target.value;
    const label = e.target.name;
    setFilterMonth(value);
    console.log(`${urlSearchLead}${label}=${value}`);
    if (e.target.value === null) {
      fetchRecords();
    } else {
      RequestServer(apiMethods.post, urlSearchLead + label + "=" + value)
        .then((res) => {
          console.log("Searched Month res ", res);
          if (res.success) {
            setFilteredRecord(res.data);
          } else {
            fetchRecords();
          }
        })
        .catch((err) => {
          console.log("Search Error is ", err);
        });
    }
  };
  const columns = [
    {
      field: "fullName",
      headerName: "Full Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "leadSource",
      headerName: "Lead Source",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "industry",
      headerName: "Industry",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "leadStatus",
      headerName: "Lead Status",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "center",
      align: "center",
      flex: 1,
    }]
  if (permissionValues.delete) {
    columns.push(
      {
        field: "actions",
        headerName: "Actions",
        headerAlign: "center",
        align: "center",
        width: 400,
        flex: 1,
        renderCell: (params) => {
          return (
            <>
              {!showDelete ? (
                <>
                  {/* <IconButton  onClick={(e) => handleOnCellClick(e, params.row)} style={{ padding: '20px', color: '#0080FF' }}>
                        <EditIcon />
                      </IconButton> */}
                  <IconButton
                    onClick={(e) => onHandleDelete(e, params.row)}
                    style={{ padding: "20px", color: "#FF3333" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              ) : (null)}
            </>);
        },
      },
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
        {
          permissionValues.read ?
            <>
              <Typography
                variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ m: "0 0 5px 0" }}
              >
                Leads
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h5" color={colors.greenAccent[400]}>
                  <strong>List Of {filterMonth} Leads</strong>
                </Typography>

                <div
                  style={{
                    display: "flex",
                    width: "380px",
                    justifyContent: "space-evenly",
                    height: "30px",
                  }}
                >
                  {showDelete ? (
                    <>
                      <div
                        style={{
                          width: "350px",
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "15px",
                        }}
                      >
                        {
                          permissionValues.create &&
                          <>
                            <Tooltip title="Email">
                              <IconButton>
                                <EmailIcon
                                  sx={{ color: "#DB4437" }}
                                  onClick={handlesendEmail}
                                />
                              </IconButton>
                            </Tooltip>
                            {/*  <Tooltip title="Whatsapp"> 
                    <IconButton> <WhatsAppIcon sx={{ color: '#34A853' }} onClick={handlesendWhatsapp} /> </IconButton>
                  </Tooltip> */}
                          </>
                        }
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
                        permissionValues.read &&

                        <FormControl sx={{ mr: 1, bottom: "8px" }} size="small">
                          <InputLabel id="demo-simple-select-label">
                            <b> Select Lead Month </b>
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filterMonth}
                            label="Select Lead Month"
                            name="month"
                            style={{ width: 155 }}
                            SelectDisplayProps={{
                              style: { paddingTop: "12px" },
                            }}
                            onChange={handleLeadFilterChange}
                          >
                            <MenuItem value={null}>
                              <em>None</em>
                            </MenuItem>
                            {LeadMonthPicklist.map((i) => {
                              return <MenuItem value={i.value}>{i.text}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      }
                      {
                        permissionValues.create &&
                        <>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleImportModalOpen}
                            sx={{ color: "white" }}
                          >
                            Import
                          </Button>

                          <Button
                            variant="contained"
                            color="info"
                            onClick={handleAddRecord}
                          >
                            New
                          </Button>
                          <ExcelDownload data={records} filename={`LeadRecords`} />
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
                  rows={filteredRecord}
                  columns={columns}
                  getRowId={(row) => row._id}
                  pageSize={7}
                  rowsPerPageOptions={[7]}
                  // onCellClick={handleOnCellClick}
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
            : null
        }
      </Box>

      <Modal
        open={importModalOpen}
        onClose={handleImportModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal">
          <ModalFileUpload handleModal={handleImportModalClose} />
        </div>
      </Modal>

      <Modal
        open={emailModalOpen}
        onClose={setEmailModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal">
          <EmailModalPage
            data={selectedRecordDatas}
            handleModal={setEmailModalClose}
            bulkMail={true}
          />
        </div>
      </Modal>

      <Modal
        open={whatsAppModalOpen}
        onClose={setWhatAppModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal">
          <WhatAppModalPage
            data={selectedRecordDatas}
            handleModal={setWhatAppModalClose}
            bulkMail={true}
          />
        </div>
      </Modal>
    </>
  );
};

export default Leads;
