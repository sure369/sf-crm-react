import React ,{ useEffect, useState ,useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {useLocation ,useNavigate} from 'react-router-dom';
import { Card,CardContent ,Box ,Button,Typography,Modal } from "@mui/material";
import axios from 'axios'
import TaskDetailPage from "../recordDetailPage/TaskDetailPage";
import TaskModalPage from "./Modal";

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

const TaskCard = ({item}) => {

    const navigate = useNavigate();
    const location = useLocation();
    const[relatedTask,setRelatedTask] = useState([]);
    const[modalOpen,setModalOpen] = useState(false);


    useEffect(()=>{
        console.log('inside useEffect', location.state.record.item);

        getTasks(location.state.record.item._id) 
        
        
    },[])

    const getTasks =(leadsId)=>{
         const urlTask ="http://localhost:4000/api/getTaskbyLeadId?searchId=";
       

        axios.post(urlTask+leadsId)
        .then((res)=>{
            console.log('response task fetch',res.data);
            if(res.data.length>0){
                setRelatedTask (res.data);
              }
              else{  
                setRelatedTask([]);
              } 
        })
        .catch((error)=>{
            console.log('error task fetch',error)
        })

    }
    
    const handleModalOpen =()=>{

        setModalOpen(true); 
    } 
    const handleModalClose =()=>{

        setModalOpen(false);
    }

    return (
      <>
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
                
                    <h3> Related Task</h3> 
               
            </div>
            <div style={{ textAlign: "end", marginBottom: "10px" }}>

                <Button onClick={() => handleModalOpen()}>New Task</Button>


            </div>
       <Card dense compoent="span" sx={{ bgcolor: "white" }}>
      {
           
            relatedTask.length>0 ?
            relatedTask  
            .map((item)=>{
                return (
             
                    <div>
                      <CardContent sx={{ bgcolor: "aliceblue", m: "15px" }}>
                        <div
                          key={item.Id}
                          button
                          onClick={() => console.log(item.Id)}
                        >
                        
                          <div>Subject : {item.subject} </div>
                          <div>Date&Time :{item.startDate}  {item.startTime}</div>
                          <div>Description : {item.description} </div>
                          
                        </div>
                      </CardContent>
                    </div>
              
                  );
                })
              :"No Data"
            }

       </Card>

       <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        
            <TaskModalPage/>


        </Box>
      </Modal>

      </>
    )

  }
export default TaskCard

