import React,{useState,useEffect} from 'react';
import { Box, Button ,IconButton,useTheme} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import UserForm from "../formik/UserForm";
import axios from 'axios';
import {  useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SimpleSnackbar from "../toast/test";

const Users = () => {

  const urlDelete ="http://localhost:4000/api/delete?code=";
  const urlUsers ="http://localhost:4000/api/Users";

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

    }, []
  );

  const fetchRecords=()=>{
    axios.post(urlUsers)
    .then(
      (res) => {
        console.log("res users records", res);
        setRecords(res.data);
      }
    )
    .catch((error)=> {
      console.log('res users error',error);
    })
  }

  const handleOnCellClick = (e,row) => {
     setFinalClickInfo(e);
    console.log('req selected  rec',row);
    const item=row;
    navigate("/userDetailPage",{state:{record:{item}}})
  };
    
  const handleOpen = () => {
    navigate("/userDetailPage",{state:{record:{}}})
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
      field: "firstName",headerName: "First Name",
      headerAlign: 'center',align: 'center',flex: 1,
    },
    { 
      field: "lastName",headerName: "Last Name",
      headerAlign: 'center',align: 'center',flex: 1,
    }, 
    {
      field: "email",headerName: "Email",
      headerAlign: 'center',align: 'center',flex: 1,
    },
    {
      field: "role",headerName: "Role",
      headerAlign: 'center',align: 'center',flex: 1,
    },
    {
      field: "access",headerName: "Access",
      headerAlign: 'center',align: 'center',flex: 1,
    },
    { 
      field: 'actions', headerName: 'Actions', width: 400,
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

  if(records.length>=0)
  {
  return(
    <>
    {
      showAlert? <SimpleSnackbar severity={alertSeverity}  message={alertMessage} showAlert={showAlert} onClose={toastCloseCallback} /> :<SimpleSnackbar message={showAlert}/>
     } 

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
    )
  }
};

export default Users;
