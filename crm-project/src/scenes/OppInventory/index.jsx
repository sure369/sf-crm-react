import React,{useState,useEffect} from 'react';
import { Box,Button ,useTheme,IconButton,Pagination} from "@mui/material";
import { DataGrid, GridToolbar,
  gridPageCountSelector,gridPageSelector,
  useGridApiContext,useGridSelector} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from 'axios';
import {  useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Notification from '../toast/Notification';
import ConfirmDialog from '../toast/ConfirmDialog';
const OppInventoryJunction = () => {
  
  const urlOpportunityInventory =`${process.env.REACT_APP_SERVER_URL}/opportuintyinventory`;
  const urlDelete =`${process.env.REACT_APP_SERVER_URL}/deleteOpportunityInventory?code=`;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const[records,setRecords] = useState([]);
  const[fetchLoading,setFetchLoading]=useState(true);
  // notification
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  //dialog
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })


  useEffect(()=>{
    fetchRecords();
    
    }, []
  );

  const fetchRecords=()=>{
    axios.post(urlOpportunityInventory)
    .then(
      (res) => {
        console.log("res Jn Inventory Opportunity records", res);
          if(res.data.length>0  && (typeof(res.data) !=='string')){
            setRecords(res.data);
            setFetchLoading(false)
          }
          else{  
            setRecords([]);
            setFetchLoading(false)
          };        
      }
    )
    .catch((error)=> {
      console.log('res Jn Inventory Opportunity error',error);
      setFetchLoading(false)
    })
  }

  const handleAddRecord = () => {    
    navigate("/new-OppInventory", {state:{record: {}}})
  };

  const handleOnCellClick =(e,row) => {
    console.log('selected record',row);
    const item=row;
    navigate("/opportunityInventoryDetailPage",{state:{record:{item}}})
  };
  
  const onHandleDelete = (e, row) => {
    e.stopPropagation();
    console.log('req delete rec',row);
    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to delete this Record ?`,
      subTitle: "You can't undo this Operation",
      onConfirm: () => { onConfirmDeleteRecord(row) }
    })
  }

  const onConfirmDeleteRecord=(row)=>{
    console.log('onConfirmDeleteRecord row', row)
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })

    axios.post(urlDelete+row._id)
    .then((res)=>{
        console.log('api delete res',res); 
        fetchRecords();
       setNotify({
          isOpen: true,
          message: res.data,
          type: 'success'
        })
    })
    .catch((error)=> {
        console.log('api delete error',error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: 'error'
        })
      })
  };

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
          <IconButton style={{ padding: '20px',color: '#0080FF'  }}>
            <EditIcon onClick={(e) => handleOnCellClick(e, params.row)} />
          </IconButton>
          <IconButton style={{ padding: '20px' ,color: '#FF3333' }}>
            <DeleteIcon onClick={(e) => onHandleDelete(e, params.row)} />
          </IconButton>
        </>
      )} 
    }
  ];

   
  return (
    <>
   <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />

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
          "& .MuiDataGrid-columnHeaderTitle": { 
            fontWeight: 'bold !important',
            overflow: 'visible !important'
         },
          "& .MuiDataGrid-virtualScroller": {
            // backgroundColor: colors.primary[400],
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
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#CECEF0"
          },                     
          "& .C-MuiDataGrid-row-even":{
            backgroundColor: "#D7ECFF",
          }, 
          "& .C-MuiDataGrid-row-odd":{
            backgroundColor: "#F0F8FF",
          },
        }}
      >
       <div  className='btn-test'>
            <Button 
               variant="contained" color="info" 
               onClick={handleAddRecord} 
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
              components={{ 
                Pagination:CustomPagination,
                Toolbar: GridToolbar }}
              loading={fetchLoading}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'C-MuiDataGrid-row-even' : 'C-MuiDataGrid-row-odd'
              }
        />
      </Box>
    </Box>
    </>
  )
 }


export default OppInventoryJunction;
