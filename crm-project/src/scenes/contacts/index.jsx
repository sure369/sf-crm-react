import React,{useState,useEffect} from 'react';
import { Box,Button,IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from 'axios';
import SimpleSnackbar from "../toast/test";
import {  useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Contacts = () => {
  
  const urlContact ="http://localhost:4000/api/contacts";
  const urlDelete ="http://localhost:4000/api/deleteContact?code=";

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const[records,setRecords] = useState([]);
  const [finalClickInfo, setFinalClickInfo] = useState(null);

  //toast 
  const[showAlert,setShowAlert] = useState(false);
    const[alertMessage,setAlertMessage]=useState();
    const[alertSeverity,setAlertSeverity]=useState();

  useEffect(()=>{
    fetchRecords();
  
  }, []);

  const fetchRecords=()=>{
    axios.post(urlContact)
    .then(
      (res) => {
        console.log("res Contact records", res);
        setRecords(res.data);
      }
    )
    .catch((error)=> {
      console.log('error',error);
    })
  }

  const handleOpen = () => {
    // navigate('/new-contacts');
    navigate("/contactDetailPage",{state:{record:{}}})
  };

  const handleOnCellClick = (e,row) => {
    setFinalClickInfo(e);
    console.log('selected record',row);
    const item=row;
    navigate("/contactDetailPage",{state:{record:{item}}})
  };
 
 
  const onHandleDelete = (e, row) => {
    e.stopPropagation();
    console.log('req delete rec',row);
    console.log('req delete rec id',row._id);
    
    axios.post(urlDelete+row._id)
    .then((res)=>{
        console.log('api delete response',res);
        fetchRecords();
        //delete show toast
        setShowAlert(true)
        setAlertMessage(res.data)
        setAlertSeverity('success')
    })
    .catch((error)=> {
        console.log('api delete error',error);
         //delete show toast
         setShowAlert(true)
         setAlertMessage(error.message)
         setAlertSeverity('error')
      })
  };

  const toastCloseCallback=()=>{
    setShowAlert(false)
  }

  const columns = [
    {
      field: "lastName",headerName: "Last Name",
       headerAlign: 'center',align: 'center',flex: 1,
    },
    { 
      field: "accountName",headerName: "Account Name",
      headerAlign: 'center',align: 'center',flex: 1,
    }, 
    {
      field: "phone",headerName: "Phone",
      headerAlign: 'center',align: 'center',flex: 1,
    },
    {
      field: "leadSource",headerName: "Lead Source",
      headerAlign: 'center',align: 'center',flex: 1,
    },
    {
      field: "email",headerName: "Email",
      headerAlign: 'center',align: 'center',flex: 1,
    },
    { 
      field: 'actions', headerName: 'Actions', width:400, 
      headerAlign: 'center',align: 'center',flex: 1,
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
    } }
  ];
  

  return (
    <>
    {
      showAlert? <SimpleSnackbar severity={alertSeverity}  message={alertMessage} showAlert={showAlert} onClose={toastCloseCallback} /> :<SimpleSnackbar message={showAlert}/>
     } 

    <Box m="20px">
      <Header
        title="Contacts"
        subtitle="List of Contacts"
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
          // onCellClick={handleOnCellClick}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
    </>
  );
}

export default Contacts;
