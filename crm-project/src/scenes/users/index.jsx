import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, useTheme, Pagination } from "@mui/material";
import {
  DataGrid, GridToolbar,
  gridPageCountSelector, gridPageSelector,
  useGridApiContext, useGridSelector
} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Notification from '../toast/Notification';
import ConfirmDialog from '../toast/ConfirmDialog';

const Users = () => {

  const urlDelete = "http://localhost:4000/api/delete?code=";
  const urlUsers = "http://localhost:4000/api/Users";

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const[fetchLoading,setFetchLoading]=useState(true);
  // notification
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  //dialog
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

  useEffect(() => {
    fetchRecords();

  }, []
  );

  const fetchRecords = () => {
    axios.post(urlUsers)
      .then(
        (res) => {
          console.log("res users records", res);
          if (res.data.length > 0 && (typeof (res.data) !== 'string')) {
            setRecords(res.data);
            setFetchLoading(false)
          }
          else {
            setRecords([]);
            setFetchLoading(false)
          }
        }
      )
      .catch((error) => {
        console.log('res users error', error);
        setFetchLoading(false)
      })
  }

  const handleAddRecord = () => {
    navigate("/userDetailPage", { state: { record: {} } })
  };

  const handleOnCellClick = (e, row) => {
    console.log(' selected  rec', row);
    const item = row;
    navigate("/userDetailPage", { state: { record: { item } } })
  };



  const onHandleDelete = (e, row) => {
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
    console.log('onConfirmDeleteRecord row', row)
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })

    axios.post(urlDelete + row._id)
      .then((res) => {
        console.log('api delete response', res);
        fetchRecords();
        setNotify({
          isOpen: true,
          message: res.data,
          type: 'success'
        })
      })
      .catch((error) => {
        console.log('api delete error', error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: 'error'
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
      field: "firstName", headerName: "First Name",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "lastName", headerName: "Last Name",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "email", headerName: "Email",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "role", headerName: "Role",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "access", headerName: "Access",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: 'actions', headerName: 'Actions', width: 400,
      headerAlign: 'center', align: 'center', flex: 1,
      renderCell: (params) => {
        return (
          <>
            <IconButton style={{ padding: '20px', color: '#0080FF' }}>
              <EditIcon onClick={(e) => handleOnCellClick(e, params.row)} />
            </IconButton>
            <IconButton style={{ padding: '20px', color: '#FF3333' }}>
              <DeleteIcon onClick={(e) => onHandleDelete(e, params.row)} />
            </IconButton>
          </>
        );
      }
    }
  ];

  if (records.length >= 0) {
    return (
      <>
        <Notification notify={notify} setNotify={setNotify} />
        <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />

        <Box m="20px">
          <Header
            title="Users"
            subtitle="List of Accounst"
          />
          <Box
            m="40px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderBottom: "none",
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${colors.grey[100]} !important`,
              },
            }}
          >
            <div className='btn-test'>
              <Button
                variant="contained" color="info"
                onClick={handleAddRecord}
              >
                New
              </Button>
            </div>

            <DataGrid
              rows={records}
              columns={columns}
              getRowId={(row) => row._id}
              pageSize={7}
              rowsPerPageOptions={[7]}
              components={{
                Pagination: CustomPagination,
                Toolbar: GridToolbar
              }}
              loading={fetchLoading}
            />
          </Box>
        </Box>
      </>
    )
  }
};

export default Users;
