import React,{useState,useEffect} from 'react';
import { Box,Button ,useTheme,IconButton} from "@mui/material";
import { DataGrid, GridToolbar,
  gridPageCountSelector,gridPageSelector,
  useGridApiContext,useGridSelector} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from 'axios';
import SimpleSnackbar from "../toast/SimpleSnackbar";
import {  useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Pagination from '@mui/material/Pagination';

const OppInventoryJunction = () => {
  
  const urlOpportunityInventory ="http://localhost:4000/api/opportuintyinventory";
  const urlDelete ="http://localhost:4000/api/deleteOpportunityInventory?code=";

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
    axios.post(urlOpportunityInventory)
    .then(
      (res) => {
        console.log("res Opportunity records", res);
        // setRecords(res.data);
  
          if(res.data.length>0  && (typeof(res.data) !=='string')){
            setRecords(res.data);
          }
          else{  
            setRecords([]);
          };        
      }
    )
    .catch((error)=> {
      console.log('res Opportunity error',error);
    })
  }

  const handleOpen = () => {
    // navigate('/new-OppInventory')
    
    navigate("/new-OppInventory", {state:{record: {}}})
  };

  const handleOnCellClick =(e,row) => {
    setFinalClickInfo(e);
    console.log('selected record',row);
    const item=row;
    navigate("/opportunityInventoryDetailPage",{state:{record:{item}}})
  };
  
  const onHandleDelete = (e, row) => {
    e.stopPropagation();
    console.log('req delete rec',row);
    console.log('req delete rec id',row._id);
    
    axios.post(urlDelete+row._id)
    .then((res)=>{
        console.log('api delete res',res); 
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
        field: "opportunityName",headerName: "Opportunity Name",
        headerAlign: 'center',align: 'center',flex: 1,
        renderCell: (params) => {
        
          if(params.row.Opportunitydetails.length>0){
           
            return <div className="rowitem">
              {params.row.Opportunitydetails[0].opportunityName}
            </div>;
          }
          else{
            return <div className="rowitem">
              {null}
              </div>
          }
        },
      }, 
    { 
      field: "propertyName",headerName: "Inventory Name",
      headerAlign: 'center',align: 'center',flex: 1,
      renderCell: (params) => {
      
        if(params.row.Inventorydetails.length>0){
         
          return <div className="rowitem">
            {params.row.Inventorydetails[0].propertyName}
          </div>;
        }
        else{
          return <div className="rowitem">
            {null}
            </div>
        }
      },
    }, 
   
    { 
      field: 'actions', headerName: 'Actions',
      headerAlign: 'center',align: 'center',flex: 1, width: 400,
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
      )} 
    }
  ];

   
  return (
    <>
    {
      showAlert? <SimpleSnackbar severity={alertSeverity}  message={alertMessage} showAlert={showAlert} onClose={toastCloseCallback} /> :<SimpleSnackbar message={showAlert}/>
     }

    <Box m="20px">
      <Header
        title="Opportunity-Inventory Jn"
        subtitle="List of Opportunity-Inventory Jn"
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
              pageSize={7}
              rowsPerPageOptions={[7]}
              // onCellClick={handleOnCellClick}
              components={{ 
                Pagination:CustomPagination,
                Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
    </>
  )
 }


export default OppInventoryJunction;
