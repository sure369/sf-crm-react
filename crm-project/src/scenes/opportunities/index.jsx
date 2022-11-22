import React,{useState} from 'react';
import { Box,Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockOpportunitiesData } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import OpportunityForm from "../formik/OpportunityForm";
import "bootstrap/dist/css/bootstrap.css";
const Opportunities = () => {
    
  const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    
  const [open, setOpen] = useState(false);
  
  const handleClose = () => {
    setOpen(false);
  };
    
  const handleOpen = () => {
    setOpen(true);
    console.log('test');     
  };



  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Opportunity Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "type",
      headerName: "Type",
    },
    {
      field: "stage",
      headerName: "Stage",
      flex: 1,
    },
    {
      field: "closedate",
      headerName: "Close Date",
    
    },
  ];

    
  if(open)
  {
    return(
            <OpportunityForm/>
    )
  }


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
         <Button class="btn btn-primary " onClick={handleOpen} >New </Button>
        <DataGrid
          rows={mockOpportunitiesData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Opportunities;
