import React,{useState,useEffect} from 'react';
import { Box,Button ,useTheme} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockOpportunitiesData } from "../../data/mockData";
import Header from "../../components/Header";
import OpportunityForm from "../formik/OpportunityForm";
import axios from 'axios';
import {  useNavigate } from "react-router-dom";

const Opportunities = () => {
  
  const urlOpportunity ="http://localhost:4000/api/opportunities";
  const urlDelete ="http://localhost:4000/api/deleteOpportunity?code=";

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const[records,setRecords] = useState([]);
  const [finalClickInfo, setFinalClickInfo] = useState(null);

  useEffect(()=>{
  
    fetchRecords();
    
    }, []
  );

  const fetchRecords=()=>{
    axios.post(urlOpportunity)
    .then(
      (res) => {
        console.log("res Opportunity records", res);
        setRecords(res.data);
      }
    )
    .catch((error)=> {
      console.log('error',error);
    })
  }

  const handleOpen = () => {
    navigate('/new-opportunities')
  };

  const handleOnCellClick = (params) => {
    setFinalClickInfo(params);
    console.log('selected record',params.row);
    const item=params.row;
    navigate("/opportunityDetailPage",{state:{record:{item}}})
  };
  
  const onHandleDelete = (e, row) => {
    e.stopPropagation();
    console.log('req delete rec',row);
    console.log('req delete rec id',row._id);
    
    axios.post(urlDelete+row._id)
    .then((res)=>{
        console.log('api delete res',res); 
        fetchRecords();
    })
    .catch((error)=> {
        console.log('api delete error',error);
      })
  };

  const columns = [
    {
      field: "opportunityName",
      headerName: "Opportunity Name",
    },
    { 
      field: "accountName", 
      headerName: "Account Name"
    }, 
    {
      field: "type",
      headerName: "Type",
    },
    {
      field: "leadSource",
      headerName: "Lead Source",
      flex: 1,
    },
    {
      field: "stage",
      headerName: "Stage",
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

  if(records.length>0)
  {
   
  return (
    <Box m="20px">
      <Header
        title="Opportunities"
        subtitle="List of Opportunities"
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
      <Button 
          class="btn btn-primary " 
          onClick={handleOpen} 
      >
          New 
      </Button>
      
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
  );
 }
};

export default Opportunities;
