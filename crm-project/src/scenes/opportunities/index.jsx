import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  useTheme,
  IconButton,
  Pagination,
  Tooltip,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
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

const Opportunities = () => {
  const urlOpportunity = `/opportunities`;
  const urlFilterOpportunity = `/opportunitiesFilter?code=`;
  const urlDelete = `/deleteOpportunity?code=`;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState();
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const [showDelete, setShowDelete] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState();
  const [selectedRecordDatas, setSelectedRecordDatas] = useState();

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [filterOpportunity, setFilterOpportunity] = useState("All");
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    RequestServer(urlOpportunity)
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

  const handleOppFilterChange = (e) => {
    console.log(e.target.value, "onselect");
    setFilterOpportunity(e.target.value);

    // assuming your array of objects is named "records"
    const now = new Date(); // get the current date
    const currentMonth = now.getMonth(); // get the current month (0-11)
    const nextMonth = (now.getMonth() + 1) % 12; // get the next month (0-11, wrap around to 0 if December)
    const lastMonth = (now.getMonth() - 1 + 12) % 12;
    const today = new Date();
    const thisWeekStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay()
    );
    const thisWeekEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + (6 - today.getDay())
    );
    const lastMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    const lastWeekStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() - 7
    );
    const lastWeekEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() - 1
    );
    const ninetyDaysAgo = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 90
    );
    const selectedOption = e.target.value; // replace with the selected option

    const filteredRecords = records.filter((record) => {
      if (!record.closeDate || !record.createdDate) {
        return false; // skip records without closeDate or createdDate fields
      }
      const closeDate = new Date(record.closeDate);
      const createdDate = new Date(record.createdDate);

      switch (selectedOption) {
        case "Closing_This_Month":
          return (
            closeDate.getMonth() === currentMonth &&
            closeDate.getFullYear() === now.getFullYear()
          );
        case "Closing_Next_Month":
          return (
            closeDate.getMonth() === nextMonth &&
            closeDate.getFullYear() === now.getFullYear()
          );
        case "Closing_Last_Month":
          return (
            closeDate.getMonth() === lastMonth &&
            closeDate.getFullYear() === now.getFullYear()
          );
        case "New_This_Week":
          return createdDate >= thisWeekStart && createdDate <= thisWeekEnd;
        case "New_Last_Week":
          return createdDate >= lastWeekStart && createdDate <= lastWeekEnd;
        case "New_This_Month":
          return (
            createdDate.getMonth() === currentMonth &&
            createdDate.getFullYear() === now.getFullYear()
          );
        case "New_Last_Month":
          return createdDate >= lastMonthStart && createdDate <= lastMonthEnd;
        case "Last_90_Days":
          return createdDate >= ninetyDaysAgo && createdDate <= now;
        default:
          return true; // return all records if no valid option is selected
      }
    });

    console.log(filteredRecords, "filteredRecords"); // output the filtered records

    setFilteredRecords(filteredRecords);
    //     // assuming your array of objects is named "records"
    // const now = new Date(); // get the current date
    // const currentMonth = now.getMonth(); // get the current month (0-11)
    // const nextMonth = (currentMonth + 1) % 12; // get the next month (0-11, wrap around to 0 if December)

    // // filter records for the current month
    // const currentMonthRecords = records.filter(record => {
    //   const closeDate = new Date(record.closeDate);
    //   return closeDate.getMonth() === currentMonth && closeDate.getFullYear() === now.getFullYear();
    // });

    // // filter records for the next month
    // const nextMonthRecords = records.filter(record => {
    //   const closeDate = new Date(record.closeDate);
    //   return closeDate.getMonth() === nextMonth && closeDate.getFullYear() === (now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear());
    // });

    // // filter records created this month
    // const thisMonthRecords = records.filter(record => {
    //   const createdDate = new Date(record.createdDate);
    //   const thisMonth = new Date().getMonth();
    //   return createdDate.getMonth() === thisMonth;
    // });
    // console.log(thisMonthRecords,"thisMonthRecords")

    // // filter records created this week
    // const today = new Date();
    // const thisWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    // const thisWeekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
    // console.log(thisWeekStart,"thisWeekStart")
    // console.log(thisWeekEnd,"thisWeekEnd")
    // const thisWeekRecords = records.filter(record => {
    //   const createdDate = new Date(record.createdDate);
    //   console.log(createdDate,"createdDate")
    //   console.log(createdDate >= thisWeekStart && createdDate <= thisWeekEnd,"thisWeekRecords")
    //   return createdDate >= thisWeekStart && createdDate <= thisWeekEnd;
    // });
    // console.log(thisWeekRecords,"thisWeekRecords")

    // // filter records created last week
    // const lastWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7);
    // const lastWeekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 1);
    // const lastWeekRecords = records.filter(record => {
    //   const createdDate = new Date(record.createdDate);
    //   return createdDate >= lastWeekStart && createdDate <= lastWeekEnd;
    // });

    // console.log(lastWeekRecords,"lastWeekRecords")
    // // filter records created last month
    // const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    // const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    // const lastMonthRecords = records.filter(record => {
    //   const createdDate = new Date(record.createdDate);
    //   return createdDate >= lastMonthStart && createdDate <= lastMonthEnd;
    // });

    // console.log(lastMonthRecords,"lastMonthRecords")

    // if(e.target.value ==='Closing This Month'){
    //   console.log('1st')
    //   console.log(currentMonthRecords,"currentMonthRecords")
    //   setFilteredRecords(currentMonthRecords)
    // }
    // else if(e.target.value ==='Closing Next Month'){
    //   console.log('2nd')
    //   console.log(nextMonthRecords,"nextMonthRecords")
    //   setFilteredRecords(nextMonthRecords)
    // }
    // else if(e.target.value ==='All'){
    //   setFilteredRecords(records)
    // }

    console.log(records, "allRecords");

    //
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
    },
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
          Opportunities
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" color={colors.greenAccent[400]}>
            List Of {filterOpportunity} Opportunities
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
                <ExcelDownload data={records} filename={`OpportunityRecords`} />
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
    </>
  );
};
export default Opportunities;
