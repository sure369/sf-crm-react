import React ,{ useEffect, useState ,useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {useLocation ,useNavigate} from 'react-router-dom';
import { Card,CardContent} from "@mui/material";
import axios from 'axios'

const TaskCard = ({item}) => {

    const location = useLocation();
    const[relatedTask,setRelatedTask] = useState([]);

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
    return (
      <>
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
                
                    <h3> Related Task</h3> 
               
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
      </>
    )

  }
export default TaskCard

