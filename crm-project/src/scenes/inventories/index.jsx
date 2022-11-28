import React,{useState,useEffect} from 'react';
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import InventoryForm from "../formik/InventoryForm";
import axios from 'axios';

import {  useNavigate } from "react-router-dom";




const Inventories = () => {

  const urlDelete ="http://localhost:4000/api/deleteInventory?code=";
  const urlInventory ="http://localhost:4000/api/inventories";
  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const[records,setRecords] = useState([]);
  const [finalClickInfo, setFinalClickInfo] = useState(null);

  useEffect(()=>{
    axios.post(urlInventory)
    .then(
      (res) => {
        console.log("res Account records", res);
        setRecords(res.data);
      }
    )
    .catch((error)=> {
      console.log('res Account error',error);
    })
  }, []);

  const handleOnCellClick = (params) => {
    setFinalClickInfo(params);
    console.log('selected record',params.row);
    const item=params.row;
    navigate("/inventoryDetailPage",{state:{record:{item}}})
  };

  const handleClose = () => {
    setOpen(false);
  };
    
  const handleOpen = () => {
    setOpen(true);    
  };
  const onHandleDelete = (e, row) => {
    e.stopPropagation();
    console.log('req delete rec',row);
    console.log('req delete rec id',row._id);
    
    axios.post(urlDelete+row._id)
    .then((res)=>{
        console.log('api delete response',res);
    })
    .catch((error)=> {
        console.log('api delete error',error);
      })
  };
  const columns = [
    {
      field: "projectName",
      headerName: "Project Name",
    },
    { 
      field: "propertyName", 
      headerName: "Property Name"
    }, 
    {
      field: "type",
      headerName: "Type",
    },
    {
      field: "country",
      headerName: "Country",
      flex: 1,
    },
    {
      field: "status",
      headerName: "status",
      flex: 1,
    },
    { field: 'actions', headerName: 'Actions',flex: 1, width: 400, renderCell: (params) => {
      return (
        <Button
          onClick={(e) => onHandleDelete(e, params.row)}
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
            <InventoryForm/>
    )
  }
  

  if(records.length>0)
  {
  return(
      <Box m="20px">
       <Header
        title="Inveinventories"
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

export default Inventories;
