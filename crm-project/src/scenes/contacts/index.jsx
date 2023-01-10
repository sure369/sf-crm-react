import React,{useState,useEffect} from 'react';
import { Box,Button,IconButton ,Typography ,Modal } from "@mui/material";
import { DataGrid, GridToolbar,
  gridPageCountSelector,gridPageSelector,
  useGridApiContext,useGridSelector} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from 'axios';
import SimpleSnackbar from "../toast/SimpleSnackbar";
import {  useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Pagination from '@mui/material/Pagination';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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

  //modal
  const [open, setOpen] = React.useState(true);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);

  useEffect(()=>{
    console.log('contact index')
    fetchRecords();
  
  }, []);

  const fetchRecords=()=>{
    axios.post(urlContact)
    .then(
      (res) => {
        console.log("res Contact records", res);
        if(res.data.length>0  && (typeof(res.data) !=='string')){
          setRecords(res.data);
        }
        else{  
        setRecords([]);
        }
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
      
      // <Modal
      //   open={true}
      //   onClose={handleModalClose}
      //   aria-labelledby="modal-modal-title"
      //   aria-describedby="modal-modal-description"
      // >
      //   <Box sx={modalStyle}>
      //     <Typography id="modal-modal-title" variant="h6" component="h2">
      //       Text in a modal
      //     </Typography>
      //     <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      //       Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      //       </Typography>
      //   </Box>

      // </Modal>



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
      field: "lastName",headerName: "Last Name",
       headerAlign: 'center',align: 'center',flex: 1,
    },
    { 
      field: "accountName",headerName: "Account Name",
      headerAlign: 'center',align: 'center',flex: 1,
      renderCell: (params) => {
        return <div className="rowitem">
        {params.row.accountDetails.accountName}
      </div>

      // if(params.row.accountDetails.length>0){
      //   console.log('if');
       
      // }
      // else{
      //   console.log('else')
      //   return <div className="rowitem">
      //     {null}
      //     </div>
      // }
        
      },
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
            // borderTop: "none",
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
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
          pageSize={7}
          rowsPerPageOptions={[7]}
          // onCellClick={handleOnCellClick}
          components={{ Toolbar: GridToolbar ,
                        Pagination:CustomPagination,
                        }}
        />
      </Box>
    </Box>
    </>
  );
}

export default Contacts;
