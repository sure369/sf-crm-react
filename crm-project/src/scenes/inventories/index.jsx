import React, { useState, useEffect } from 'react';
import { Box, Button, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import SimpleSnackbar from "../toast/test";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
const Inventories = () => {

  const urlDelete = "http://localhost:4000/api/deleteInventory?code=";
  const urlInventory = "http://localhost:4000/api/inventories";

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [finalClickInfo, setFinalClickInfo] = useState(null);

  //toast 
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [alertSeverity, setAlertSeverity] = useState();

  useEffect(() => {

    fetchRecords();

  }, []);

  const fetchRecords = () => {
    axios.post(urlInventory)
      .then(
        (res) => {
          console.log("res Inventory records", res);
          setRecords(res.data);
        }
      )
      .catch((error) => {
        console.log('res Inventory error', error);
      })
  }

  const handleOpen = () => {
    // navigate('/new-inventories')
    navigate("/inventoryDetailPage", {state:{record: {}}})
  };

  const handleOnCellClick = (e, row) => {
    setFinalClickInfo(e);
    console.log('selected record', row);
    const item = row;
    navigate("/inventoryDetailPage", { state: { record: { item } } })
  };


  const onHandleDelete = (e, row) => {
    e.stopPropagation();
    console.log('req delete rec', row);
    console.log('req delete rec id', row._id);

    axios.post(urlDelete + row._id)
      .then((res) => {
        console.log('api delete response', res);
        fetchRecords();
        //delete show toast
        setShowAlert(true)
        setAlertMessage(res.data)
        setAlertSeverity('success')
      })
      .catch((error) => {
        console.log('api delete error', error);
        //delete show toast
        setShowAlert(true)
        setAlertMessage(error.message)
        setAlertSeverity('error')
      })
  };

  const toastCloseCallback = () => {
    setShowAlert(false)
  }

  const columns = [
    {
      field: "projectName", headerName: "Project Name",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "propertyName", headerName: "Property Name",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "type", headerName: "Type",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "country", headerName: "Country",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "status", headerName: "status",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: 'actions', headerName: 'Actions',
      headerAlign: 'center', align: 'center', flex: 1, width: 400,
      renderCell: (params) => {
        return (
          <>
            <IconButton style={{ padding: '20px' }}>
              <EditIcon onClick={(e) => handleOnCellClick(e, params.row)} />
            </IconButton>
            <IconButton style={{ padding: '20px' }}>
              <DeleteIcon onClick={(e) => onHandleDelete(e, params.row)} />
            </IconButton>
          </>
        );
      }
    }
  ];


    return (
      <>
        {
          showAlert ? <SimpleSnackbar severity={alertSeverity} message={alertMessage} showAlert={showAlert} onClose={toastCloseCallback} /> : <SimpleSnackbar message={showAlert} />
        }

        <Box m="20px">
          <Header
            title="Inventories"
            subtitle="List of Inventory"
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
                borderTop: "none",
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

        <div  className='btn-test'>
            <Button 
               variant="contained" color="info" 
               onClick={handleOpen} 
            >
                  New 
          </Button>
        </div>
            <DataGrid
              rows={records}
              columns={columns}
              getRowId={(row) => row._id}
              pageSize={5}
              rowsPerPageOptions={[5]}
              onCellClick={handleOnCellClick}
              components={{ Toolbar: GridToolbar }}
            />
          </Box>
        </Box>
      </>
    )
  }

export default Inventories;
