import React,{useState,useEffect} from 'react';
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockAccountData } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import AccountForm from "../formik/AccountForm";
import axios from 'axios';

import {  useNavigate } from "react-router-dom";


const urlDelete ="http://localhost:4000/delete?code=";
const urlAccount ="http://localhost:4000/accounts";

const Accounts = () => {

  const navigate = useNavigate();


  const[records,setRecords] = useState([]);
  const[showRecords,setShowRecords] =useState(false);
  const [finalClickInfo, setFinalClickInfo] = useState(null);

  const handleOnCellClick = (params) => {
    setFinalClickInfo(params);
    console.log('params',params.row);
    const item=params.row;
    console.log('item',item);
    navigate("/accountDetailPage",{state:{record:{item}}})
  };
  useEffect(()=>{
  
    axios.post(urlAccount)
    .then(
      (res) => {
        console.log("inside get records", res);
        setRecords(res.data);
      }
    )
    .catch((error)=> {
      console.log('error',error);
    })


}, []);


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = useState(false);
  
  const handleClose = () => {
    setOpen(false);
  };
    
  const handleOpen = () => {
    setOpen(true);    
  };
  const onButtonClick = (e, row) => {
    e.stopPropagation();
    //do whatever you want with the row
    console.log('event',e);
    console.log('row',row);
    console.log('id',row._id);
    // axios.post("http://localhost:5600/api/connection?code="+codeurl)
    axios.post(urlDelete+row._id)
    .then((res)=>{
        console.log('post response',res);
        console.log('post ','data send');
      
    })
    .catch((error)=> {
        console.log('error',error);
      })
    

  };
  const columns = [
    { 
      field: "_id", 
      headerName: "ID"
    }, 
    {
      field: "accountName",
      headerName: "Name",
    },
    {
      field: "billingCity",
      headerName: "City",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
    },
    {
      field: "industry",
      headerName: "Industry",
      flex: 1,
    },
    { field: 'actions', headerName: 'Actions',flex: 1, width: 400, renderCell: (params) => {
      return (
        <Button
          onClick={(e) => onButtonClick(e, params.row)}
          variant="contained" sx={{ bgcolor: 'red'}}
        >
          Delete
        </Button>
      );
    } }
  ];

 


  if(open)
  {
    return(
            <AccountForm/>
    )
  }
  

  if(records!==undefined)
  {
    console.log('records',records);

  return(
      <Box m="20px">



       <Header
        title="Accounts"
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

          <Button class="btn btn-primary " onClick={handleOpen} >New </Button>


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
    )
  }

};

export default Accounts;
