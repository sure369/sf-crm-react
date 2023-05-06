import React, { useState, useEffect } from 'react';
import {
  Box, Button, useTheme, IconButton,
  Pagination, Tooltip, Card, CardContent, Grid, MenuItem, Menu
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import ToastNotification from '../toast/ToastNotification';
import DeleteConfirmDialog from '../toast/DeleteConfirmDialog';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { RequestServer } from '../api/HttpReq';

const OpportunitiesMobile = () => {

  const urlOpportunity = `/opportunities`;
  const urlDelete = `/deleteOpportunity?code=`;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError,setFetchError]=useState()
  // notification
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  //dialog
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

  const [showDelete, setShowDelete] = useState(false)
  const [selectedRecordIds, setSelectedRecordIds] = useState()
  const [selectedRecordDatas, setSelectedRecordDatas] = useState()

  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(0);

  useEffect(() => {
    fetchRecords();
  }, []
  );

  const fetchRecords = () => {
    RequestServer(urlOpportunity)
    .then((res)=>{
      console.log(res,"index page res")
      if(res.success){
        setRecords(res.data)
        setFetchLoading(false)
        setFetchError(null)
        setNoOfPages(Math.ceil(res.data.length / itemsPerPage));
      }
      else{
        setRecords([])
        setFetchError(res.error.message)
        setFetchLoading(false)
      }
    })
    .catch((err)=>{
      setFetchError(err.message)
      setFetchLoading(false)
    })
  }

  const handleAddRecord = () => {
    navigate("/new-opportunities", { state: { record: {} } })
  };

  const handleCardEdit = (row) => {
    console.log('selected record', row);
    const item = row;
    navigate(`/opportunityDetailPage/${item._id}`, { state: { record: { item } } })
  };

  const handleCardDelete = (e, row) => {
    e.stopPropagation();
    console.log('req delete rec', row);
    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to delete this Record ?`,
      subTitle: "You can't undo this Operation",
      onConfirm: () => { onConfirmDeleteRecord(row) }
    })
  }
  const onConfirmDeleteRecord = (row) => {
    if (row.length) {
      console.log('if row', row);
      row.forEach(element => {
        onebyoneDelete(element)
      });
    }
    else {
      console.log('else', row._id);
      onebyoneDelete(row._id)
    }
  }
  const onebyoneDelete = (row) => {
    console.log('onebyoneDelete rec id', row)

    RequestServer(urlDelete + row )
    .then((res)=>{
      if(res.success){
        fetchRecords()
        setNotify({
          isOpen:true,
          message:res.data,
          type:'success'
        })
        setMenuOpen(false)
      }
      else{
        console.log(res,"error in then")
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: 'error'
          })
          setMenuOpen(false)
      }
    })
    .catch((error)=>{
      console.log('api delete error', error);
          setNotify({
            isOpen: true,
            message: error.message,
            type: 'error'
          })
    })
    .finally(()=>{
      setConfirmDialog({
        ...confirmDialog,
        isOpen: false
      })
    })
  };
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // menu dropdown strart //menu pass rec
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuSelectRec, setMenuSelectRec] = useState()
  const [menuOpen, setMenuOpen] = useState();

  const handleTaskMoreMenuClick = (item, event) => {
    setMenuSelectRec(item)
    setAnchorEl(event.currentTarget);
    setMenuOpen(true)
  };
  const handleMoreMenuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false)
  };
  // menu dropdown end

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} moreModalClose={handleMoreMenuClose} />

      <Box m="20px">
        <Header
          title="Opportunities"
          subtitle="List of Opportunity"
        />

        <div className='btn-test'>
          <Button variant="contained" color="info" onClick={handleAddRecord}>
            New
          </Button>
        </div>

        <Card dense compoent="span" sx={{ bgcolor: "white" }}>
          {records.length > 0 ?
            records
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((item) => {
                return (
                  <div>
                    <CardContent sx={{ bgcolor: "aliceblue", m: "20px" }}>
                      <div
                        key={item._id}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={10} md={10}>
                            <div>Name : {item.opportunityName} </div>
                            <div>Type :{item.type} </div>
                            <div>Stage : {item.stage} </div>
                            <div>Amount : {item.amount} </div>

                          </Grid>
                          <Grid item xs={2} md={2}>
                            <IconButton>
                              <MoreVertIcon onClick={(event) => handleTaskMoreMenuClick(item, event)} />
                              <Menu
                                anchorEl={anchorEl}
                                open={menuOpen}
                                onClose={handleMoreMenuClose}
                                anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'left',
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'left',
                                }}
                              >
                                <MenuItem onClick={() => handleCardEdit(menuSelectRec)}>Edit</MenuItem>
                                <MenuItem onClick={(e) => handleCardDelete(e, menuSelectRec)}>Delete</MenuItem>
                              </Menu>
                            </IconButton>
                          </Grid>
                        </Grid>
                      </div>
                    </CardContent>
                  </div>
                );
              })
            :
            <>
              <CardContent sx={{ bgcolor: "aliceblue", m: "20px" }}>
                <div>No Records Found</div>
              </CardContent>
            </>
          }
        </Card>
        {records.length > 0 &&
          <Box
            sx={{
              margin: "auto",
              width: "fit-content",
              alignItems: "center",
              // justifyContent:'space-between'
            }}>
            <Pagination
              count={noOfPages}
              page={page}
              onChange={handleChangePage}
              defaultPage={1}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{ justifyContent: 'center' }}
            />
          </Box>
        }
      </Box>
    </>
  )
}
export default OpportunitiesMobile;
