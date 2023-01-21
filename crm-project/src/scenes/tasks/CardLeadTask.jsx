import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Card, CardContent, Box, Button, Typography, Modal
    , IconButton ,Grid 
} from "@mui/material";
import axios from 'axios'
import TaskModalPage from "./ModalLeadTask";
import DeleteIcon from '@mui/icons-material/Delete';
import ModeIcon from '@mui/icons-material/Mode';

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

const CardTask = ({ item }) => {

    

  const urlDelete ="http://localhost:4000/api/deleteTask?code=";

    const navigate = useNavigate();
    const location = useLocation();
    const [relatedTask, setRelatedTask] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const[leadRecordId,setLeadRecordId] =useState() 
    
    const[showAlert,setShowAlert] = useState(false);
    const[alertMessage,setAlertMessage]=useState();
    const[alertSeverity,setAlertSeverity]=useState();

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
   
        console.log('selected record',row);
        const item=row;
         navigate("/taskDetailPage",{state:{record:{item}}})
      };

      const handleCardDelete = ( row) => {
     
        console.log('req delete rec',row);
        console.log('req delete rec id',row._id);
     
        axios.post(urlDelete+row._id)
        .then((res)=>{
            console.log('api delete response',res);
            console.log('inside delete response leadRecordId',leadRecordId)
             getTasks(leadRecordId)
            setShowAlert(true)
            setAlertMessage(res.data)
            setAlertSeverity('success') 
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

    return (
        <>
         
      
            <div style={{ textAlign: "center", marginBottom: "10px" }}>

                <h3> Related Details</h3>

            </div>
            <div style={{ textAlign: "end", marginBottom: "10px" }}>

                <Button variant="contained" color="info" onClick={() => handleModalOpen()}>New Task</Button>


            </div>
           
                {

                    relatedTask.length > 0 ?
                        relatedTask
                            .map((item) => {
                                return (

                                    <div >
                                         <Card dense compoent="span" sx={{ bgcolor: "white" }}>
                                       
                                       
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
                                                <IconButton >
                                                    <ModeIcon onClick={(key) => handleCardEdit(item)} />
                                                </IconButton>
                                                 <IconButton >
                                                    <DeleteIcon onClick={(key) =>handleCardDelete(item)} />
                                                </IconButton> 
                                                </Grid>
                                                </Grid>
                                            </div>
                                        </CardContent>
                                        </Card>
                                    </div>

                                );
                            })
                        : "No Task assigned for this Lead Record "
                }


            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>

                    <TaskModalPage  props ={modalOpen} />


                </Box>
            </Modal>

        </>
    )

}
export default CardTask

