import React, { useState, useEffect } from "react";
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
import EmailModalPage from "../recordDetailPage/EmailModalPage";
import WhatAppModalPage from "../recordDetailPage/WhatsAppModalPage";
import ToastNotification from "../toast/ToastNotification";
import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import ExcelDownload from "../Excel";
import { RequestServer } from "../api/HttpReq";
import { apiMethods } from "../api/methods";
import "../indexCSS/muiBoxStyles.css";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import { apiCheckObjectPermission } from "../Auth/apiCheckObjectPermission";

const Contacts = () => {

  const OBJECT_API='Contact' ;
  const urlContact = `/contacts`;
  const urlDelete = `/deleteContact?code=`;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [notify, setNotify] = useState({ isOpen: false, message: "",type: "",});
  const [confirmDialog, setConfirmDialog] = useState({isOpen: false,title: "",subTitle: "",});

  //email,Whatsapp
  const [showEmail, setShowEmail] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState();
  const [selectedRecordDatas, setSelectedRecordDatas] = useState();
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [permissionValues,setPermissionValues] =useState({})
  
  const userRoleDpt = getLoginUserRoleDept(OBJECT_API)
  console.log(userRoleDpt, "userRoleDpt")

  useEffect(() => {
    fetchRecords();
    fetchObjectPermissions()
  }, []);

  const fetchRecords = () => {
    RequestServer(apiMethods.post, urlContact)
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
      .catch((err) => {
        setFetchError(err.message);
        setFetchLoading(false);
      });
  };

  const fetchObjectPermissions=()=>{
    if(userRoleDpt){
      apiCheckObjectPermission(userRoleDpt)
      .then(res=>{
        console.log(res,"res apiCheckObjectPermission")
        setPermissionValues(res[0].permissions)
      })
      .catch(err=>{
        console.log(err,"error apiCheckObjectPermission")
      })
    }
  }

  const handleAddRecord = () => {
    navigate("/new-contacts", { state: { record: {} } });
  };

  const handleOnCellClick = (e) => {
    console.log("selected record", e);
    const item = e.row;
    navigate(`/contactDetailPage/${item._id}`, { state: { record: { item } } });
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
      row.forEach((element) => {
        onebyoneDelete(element);
      });
    } else {
      onebyoneDelete(row._id);
    }
  };

  const onebyoneDelete = (row) => {
    console.log("one by on delete", row);

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

  const columns = [
    {
      field: "lastName",
      headerName: "Last Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "accountName",
      headerName: "Account Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        if (params.row.accountDetails) {
          return (
            <div className="rowitem">
              {params.row.accountDetails.accountName}
            </div>
          );
        } else {
          return <div className="rowitem">{null}</div>;
        }
      },
    },
    {
      field: "phone",
      headerName: "Phone",
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
      field: "email",
      headerName: "Email",
      headerAlign: "center",
      align: "center",
      flex: 1,
    }]
    if(permissionValues.delete){
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
                {!showEmail ? (
                  <>
                    {/* <IconButton onClick={(e) => handleOnCellClick(e, params.row)} style={{ padding: '20px', color: '#0080FF' }} >
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
            );
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
          Contacts
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" color={colors.greenAccent[400]}>
            List Of Contacts
          </Typography>

          <div
            style={{
              display: "flex",
              width: "200px",
              justifyContent: "space-evenly",
              height: "30px",
            }}
          >
            {showEmail ? (
              <>
                <div
                  style={{
                    width: "180px",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "15px",
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
                   }{
                    permissionValues.create &&                   
                  <Tooltip title="Email">
                    <IconButton>
                      <EmailIcon
                        sx={{ color: "#DB4437" }}
                        onClick={handlesendEmail}
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
                  variant="contained"color="info"
                  onClick={handleAddRecord}
                >
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
            rows={records}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={7}
            rowsPerPageOptions={[7]}
            components={{
              // Toolbar: GridToolbar,
              Pagination: CustomPagination,
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
              size > 0 ? setShowEmail(true) : setShowEmail(false);
              console.log("checkbox selection ids", ids);
              setSelectedRecordIds(ids);
              const selectedIDs = new Set(ids);
              const selectedRowRecords = records.filter((row) =>
                selectedIDs.has(row._id.toString())
              );
              setSelectedRecordDatas(selectedRowRecords);
              console.log("selectedRowRecords", selectedRowRecords);
            }}
            onRowClick={(e) => handleOnCellClick(e)}
          />
        </Box>
         
        </>
        :null
        }
      </Box>

      <Modal
        open={emailModalOpen}
        onClose={setEmailModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: "blur(1px)" }}
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
        sx={{ backdropFilter: "blur(1px)" }}
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

export default Contacts;
