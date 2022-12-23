import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Card, CardContent, Box, Button, Typography, Modal
    , IconButton ,Grid ,Accordion ,AccordionSummary,AccordionDetails,Pagination ,Menu, MenuItem
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ModeIcon from '@mui/icons-material/Mode';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios'
import ModalLeadTask from "../tasks/ModalLeadTask";
import SimpleSnackbar from "../toast/SimpleSnackbar";
import MoreVertIcon from '@mui/icons-material/MoreVert';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    // width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    // p: 4,


};

const LeadRelatedItems = ({ item }) => {

    

  const urlDelete ="http://localhost:4000/api/deleteTask?code=";

    const navigate = useNavigate();
    const location = useLocation();
    const [relatedTask, setRelatedTask] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const[leadRecordId,setLeadRecordId] =useState() 
    
    const[showAlert,setShowAlert] = useState(false);
    const[alertMessage,setAlertMessage]=useState();
    const[alertSeverity,setAlertSeverity]=useState();


    const [itemsPerPage, setItemsPerPage] = useState(2);
    const [page, setPage] = useState(1);
    const [noOfPages, setNoOfPages] = useState(0);


    

    useEffect(() => {
        console.log('inside useEffect', location.state.record.item);
        setLeadRecordId(location.state.record.item._id)
        getTasks(location.state.record.item._id)

    }, [])

    const getTasks = (leadsId) => {
        const urlTask = "http://localhost:4000/api/getTaskbyLeadId?searchId=";


        axios.post(urlTask + leadsId)
            .then((res) => {
                console.log('response task fetch', res.data);
                if (res.data.length > 0) {
                    setRelatedTask(res.data);  
                    setNoOfPages(Math.ceil(res.data.length / itemsPerPage));
                    setPage(1)
                }
                else {
                    setRelatedTask([]);
                }
            })
            .catch((error) => {
                console.log('error task fetch', error)
            })

    }

    const handleModalOpen = () => {

        setModalOpen(true);
    }
    const handleModalClose = () => {

        setModalOpen(false);
    }

    const handleCardEdit = (row) => {
   
        console.log('selected edit record',row);
        const item=row;
         navigate("/taskDetailPage",{state:{record:{item}}})
      };

      const handleCardDelete = ( row) => {
     
        console.log('req delete rec',row);
        // console.log('req delete rec id',row._id);
     
        axios.post(urlDelete+row._id)
        .then((res)=>{
            console.log('api delete response',res);
            console.log('inside delete response leadRecordId',leadRecordId)
             getTasks(leadRecordId)
            setShowAlert(true)
            setAlertMessage(res.data)
            setAlertSeverity('success') 
            setMenuOpen(false)
        })
        .catch((error)=> {
            console.log('api delete error',error);
            setShowAlert(true)
         setAlertMessage(error.message)
         setAlertSeverity('error')
        
          })
      };
      const toastCloseCallback=()=>{
        setShowAlert(false) 
      }

    const handleChangePage = (event, value) => {
        setPage(value);
      };

      // menu dropdown strart //menu pass rec
      const [anchorEl, setAnchorEl] = useState(null);
      const [menuSelectRec,setMenuSelectRec] =useState()
      const [menuOpen,setMenuOpen] =useState();

      const handleMoreMenuClick = (item,event) => {
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
         {
     showAlert && <SimpleSnackbar severity={alertSeverity}  message={alertMessage} showAlert={showAlert} onClose={toastCloseCallback} /> 
    } 
      
            <div style={{ textAlign: "center", marginBottom: "10px" }}>

                <h3> Related Items</h3>

            </div>

            <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h4">Task ({relatedTask.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          <div style={{ textAlign: "end", marginBottom: "5px" }}>
               <Button variant="contained" color="info" onClick={() => handleModalOpen()} >New Task</Button>
            </div>
            <Card dense compoent="span" >
           
                {

                    relatedTask.length > 0 ?
                        relatedTask
                        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                            .map((item) => {
                                return (
                                    <div >
                                       
                                        <CardContent sx={{ bgcolor: "aliceblue", m: "15px" }}>
                                            <div
                                                key={item._id}
                                            >
                                              

                                              <Grid container spacing={2}>
                                             <Grid item xs={6} md={10}>
                                                    <div>Subject : {item.subject} </div>
                                                    <div>Date&Time :{item.startDate}  {item.startTime}</div>
                                                    <div>Description : {item.description} </div>
                                             </Grid>
                                             <Grid item xs={6} md={2}>
                                   
                                             <IconButton>
                                                    <MoreVertIcon onClick={(event)=>handleMoreMenuClick(item ,event)} />
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
                                                      <MenuItem onClick={() =>handleCardDelete(menuSelectRec)}>Delete</MenuItem>
                                                    </Menu>
                                                </IconButton>

                                                 {/* <IconButton >
                                                    <ModeIcon onClick={(key) => handleCardEdit(item)} />
                                                </IconButton>
                                                 <IconButton >
                                                    <DeleteIcon onClick={(key) =>handleCardDelete(item)} />
                                                </IconButton>   */}
                                                </Grid>
                                                </Grid>
                                            </div>
                                        </CardContent>
                                    </div>
                                   
                                );
                            })
                        : ""
                }
          
                </Card>
                {
                    relatedTask.length > 0 && 
                    <Box  display="flex" alignItems="center" justifyContent="center">
                        <Pagination
                          count={noOfPages}
                          page={page}
                          onChange={handleChangePage}
                          defaultPage={1}
                          color="primary"
                          size="medium"
                          showFirstButton
                          showLastButton
                        />
                      </Box>
                }

          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant="h4">Related Records</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
           Need to work 
          </Typography>
        </AccordionDetails>
      </Accordion>
            

            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>

                    <ModalLeadTask handleModal={handleModalClose} />


                </Box>
            </Modal>

        </>
    )

}
export default LeadRelatedItems

