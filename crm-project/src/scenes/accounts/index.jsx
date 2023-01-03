import React,{useState,useEffect} from 'react';
import { Box, Button,useTheme ,IconButton,Modal} from "@mui/material";
import { DataGrid, GridToolbar,
  gridPageCountSelector,gridPageSelector,
  useGridApiContext,useGridSelector} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from 'axios';
import {  useNavigate } from "react-router-dom";
import SimpleSnackbar from "../toast/SimpleSnackbar";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Pagination from '@mui/material/Pagination';
import AccountDetailPage from '../recordDetailPage/AccountDetailPage';
import ModalDeletePage from '../recordDetailPage/DeleteModalPage';

const ModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
};

const Accounts = () => {

  const urlDelete ="http://localhost:4000/api/deleteAccount?code=";
  const urlAccount ="http://localhost:4000/api/accounts";

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const[records,setRecords] = useState([]);
  const[recNames,setRecNames]=useState([]);
  const [finalClickInfo, setFinalClickInfo] = useState(null);

  //toast 
  const[showAlert,setShowAlert] = useState(false);
  const[alertMessage,setAlertMessage]=useState();
  const[alertSeverity,setAlertSeverity]=useState();

  //modal
  const[modalOpen,setModalOpen]=useState(false)

  useEffect(()=>{
console.log('inside account index')
    fetchRecords();
   
    }, []
  );

  const fetchRecords = ()=>{
    console.log('urlAccount',urlAccount);
    axios.post(urlAccount)
    .then(
      (res) => {
        console.log("res Account records", res);
        if(res.data.length>0){
          setRecords(res.data);
        }
        else{  
        setRecords([]);
        }
       }
    )
    .catch((error)=> {
      console.log('res Account error',error);
    })
  }
  const handleOpen = () => {
    //  navigate('/new-accounts'); 
     navigate("/new-accounts",{state:{record:{}}})
    // <AccountDetailPage />
  };

  const handleOnCellClick = (e,row) => {
    setFinalClickInfo(e);
    console.log('selected record',row);
    const item=row;
    navigate("/accountDetailPage",{state:{record:{item}}})
  };
 
  const handleDeleteModalOpen =(e,row)=>{
    console.log('inside modal',row)
    setModalOpen(true);
    onHandleDelete(row);
  }

  const handleDeleteModalClose =()=>{
    setModalOpen(false);
  }

  const onHandleDelete = ( row) => {
    // e.stopPropagation();
    console.log('req delete rec',row);
    console.log('req delete rec id',row._id);
 
    // axios.post(urlDelete+row._id)
    // .then((res)=>{
    //     console.log('api delete response',res);
    //     fetchRecords();
    //     //delete show toast
    //     setShowAlert(true)
    //     setAlertMessage(res.data)
    //     setAlertSeverity('success')
    // })
    // .catch((error)=> {
    //     console.log('api delete error',error);
    //      //delete show toast

    //      setShowAlert(true)
    //      setAlertMessage(error.message)
    //      setAlertSeverity('error')
    //   })
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
      field: "accountName",headerName: "Name",
      headerAlign: 'center',align: 'center',flex: 1,
    },
    { 
      field: "phone", headerName: "Phone",
      headerAlign: 'center', align: 'center',flex: 1,
    }, 
    {
      field: "billingCity",headerName: "City",
      headerAlign: 'center',align: 'center',flex: 1,
    },
    {
      field: "annualRevenue", headerName: "annualRevenue",
      headerAlign: 'center',align: 'center',flex: 1,
      renderCell: (params) => {
        const formatCurrency = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',})
        return (
          <>
            {formatCurrency.format(params.row.annualRevenue)}
          </>
        )} 
    },
    {
      field: "industry",headerName: "Industry",
      headerAlign: 'center',align: 'center',flex: 1,
    },
    { 
      field: 'actions', headerName: 'Actions',
      headerAlign: 'center',align: 'center',width: 400, flex: 1, 
      renderCell: (params) => {
        return (
          <>
            <IconButton style={{ padding: '20px' }}>
              <EditIcon onClick={(e) => handleOnCellClick(e, params.row)} />
            </IconButton>
            <IconButton style={{ padding: '20px' }}>
              <DeleteIcon onClick={(e) => handleDeleteModalOpen(e, params.row)} />
            </IconButton>
          </>
        )} 
      }
  ];

  return(
    <>
    {
     showAlert && <SimpleSnackbar severity={alertSeverity}  message={alertMessage} showAlert={showAlert} onClose={toastCloseCallback} /> 
    } 
      <Box m="20px">
       <Header
          title="Accounts"
          subtitle="List of Accounts"
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
            borderBottom: "none",
            // borderBottomStyle:{{sx:r}},
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
      
      {/* <div style={{height: '500px', width: '100%' }}> */}

      <DataGrid
              rows={records}
              columns={columns}
              getRowId={(row) => row._id}
              pageSize={7}
              rowsPerPageOptions={[7]}
             
              // onCellClick={handleOnCellClick}
              components={{ Toolbar: GridToolbar,
                            Pagination:CustomPagination, }}
      /> 
      {/* </div> */}
    </Box> 
    </Box>

{/* Modal component */}

<Modal
        open={modalOpen}
        onClose={handleDeleteModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <ModalDeletePage handleModal={handleDeleteModalClose} />
        </Box>
      </Modal>

    </>
    )
  }
// };

export default Accounts;
