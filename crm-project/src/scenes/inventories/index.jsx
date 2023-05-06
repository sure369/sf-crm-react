import React, { useState, useEffect } from "react";
import {
  Box, Button, useTheme, IconButton,
  Pagination, Tooltip, Grid, Modal, Typography,
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
import ExcelDownload from "../Excel";
import { RequestServer } from "../api/HttpReq";
import '../indexCSS/muiBoxStyles.css'

const Inventories = () => {
  const urlDelete = `/deleteInventory?code=`;
  const urlInventory = `/inventories`;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [notify, setNotify] = useState({isOpen: false,message: "",type: "",});
  const [confirmDialog, setConfirmDialog] = useState({isOpen: false,title: "",subTitle: "",});

  const [showDelete, setShowDelete] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState();
  const [selectedRecordDatas, setSelectedRecordDatas] = useState();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    RequestServer(urlInventory)
      .then((res) => {
        console.log("index page", res);
        if (res.success) {
          setRecords(res.data);
          setFetchLoading(false);
          setFetchError(null);
        } else {
          setRecords([]);
          setFetchLoading(false);
          setFetchError(res.error.message);
        }
      })
      .catch((err) => {
        setFetchError(err.message);
        setFetchLoading(false);
      });
  };

  const handleAddRecord = () => {
    navigate("/new-inventories", { state: { record: {} } });
  };

  const handleOnCellClick = (e, row) => {
    console.log("selected record", row);
    const item = e.row;
    navigate(`/inventoryDetailPage/${item._id}`, {
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
      onebyoneDelete(row._id);
    }
  };

  const onebyoneDelete = (row) => {
    console.log("one by one Delete row", row);

    RequestServer(urlDelete + row)
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

  const columns = [
    {
      field: "projectName",headerName: "Project Name",
      headerAlign: "center", align: "center", flex: 1,
    },
    {
      field: "propertyName", headerName: "Property Name",
      headerAlign: "center",align: "center",flex: 1,
    },
    {
      field: "type",headerName: "Type",
      headerAlign: "center",align: "center",flex: 1,
    },
    {
      field: "country",headerName: "Country",
      headerAlign: "center",align: "center",flex: 1,
    },
    {
      field: "status", headerName: "Status",
      headerAlign: "center",align: "center", flex: 1,
      cellClassName: (params) => {
        const statusClassName =
          params.row.status === "Available"
            ? "inventory-status-avail-green"
            : params.row.status === "Booked"
            ? "inventory-status-booked-pink"
            : params.row.status === "Sold"
            ? "inventory-status-sold-red"
            : params.row.status === "Processed"
            ? "inventory-status-process-yellow"
            : "";
        return statusClassName;
      },
    },
    {
      field: "actions",headerName: "Actions",
      headerAlign: "center", align: "center",
      flex: 1,width: 400,
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
        );
      },
    },
  ];

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

      <Box m="20px">
        <Typography
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ m: "0 0 5px 0" }}
        >
          Inventories
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" color={colors.greenAccent[400]}>
            List Of Inventories
          </Typography>

          <div
            style={{
              display: "flex",
              width: "200px",
              justifyContent: "space-evenly",
              height: "30px",
            }}
          >
            {showDelete ? (
              <>
                <div
                  style={{
                    width: "180px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Tooltip title="Delete Selected">
                    <IconButton>
                      <DeleteIcon
                        sx={{ color: "#FF3333" }}
                        onClick={(e) => onHandleDelete(e, selectedRecordIds)}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleAddRecord}
                >
                  New
                </Button>
                <ExcelDownload data={records} filename={`AccountRecords`} />
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
            hideFooterSelectedRowCount
            components={{
              Pagination: CustomPagination,
              // Toolbar: GridToolbar,
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
              console.log("selectedRowRecords", selectedRowRecords);
            }}
            onRowClick={(e) => handleOnCellClick(e)}
          />
        </Box>
      </Box>
    </>
  );
};

export default Inventories;
