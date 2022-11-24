import React,{useState} from 'react';
import { Box,Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockLeadsData } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import LeadForm from "../formik/LeadForm";

const Leads = () => {
    
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
      headerName: "Name",
    },
    {
      field: "company",
      headerName: "Company",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
    },
    {
      field: "status",
      headerName: "Lead Status",
    },
  ];

  if(open)
  {
    return(
            <LeadForm/>
    )
  }

  return (
    <Box m="20px">
      <Header
        title="Leads"
        subtitle="List of Leads"
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
          rows={mockLeadsData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Leads;
