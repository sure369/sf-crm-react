import React,{useState} from 'react';
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockAccountData } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import AccountForm from "../formik/AccountForm";
import "bootstrap/dist/css/bootstrap.css";

const Accounts = () => {
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
    { field: "id", headerName: "ID"},  {
      field: "name",
      headerName: "Name",
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    },
    {
      field: "city",
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
    }
  ];

  if(open)
  {
    return(
            <AccountForm/>
    )
  }
  return (
    <>
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

       
        {/* <Modal
        onClose={handleClose}
        open={open}
        style={{
          position: 'absolute',
          border: '2px solid #000',
          backgroundColor: 'white',
          boxShadow: '2px solid black',
          height:1000,
          width: 600,
          margin: 'auto'
        }}
      >
      <form>
        <label>Name</label>
        <input placeholder='string' ></input>
      </form>
        
      </Modal> */}

        <DataGrid
          rows={mockAccountData}
          columns={columns}
          // components={{ Toolbar: GridToolbar }}
        />
      </Box>
      
    </Box>

   
  
    </>
  );
};

export default Accounts;
