import React, { useEffect, useState, useRef ,useCallback } from "react";
import { Formik, Form, Field, ErrorMessage,useField } from "formik";
import * as Yup from "yup";
import {
    Grid, Button, FormControl, Stack, Alert, DialogActions,
    Autocomplete, TextField,Table
} from "@mui/material";
import '../recordDetailPage/Form.css'
import PreviewDataload from "./PreviewUpsert";
import { apiMethods } from "../api/methods";
import { RequestServerFiles } from "../api/HttpReqFiles";
import { POST_DATALOADER_FILE_PREVIEW } from "../api/endUrls";


const URL_postFilePreview=POST_DATALOADER_FILE_PREVIEW

const ModalFileUpload = ({ object,handleModal }) => {

    const[uplodedData,setUplodedData]=useState([])
    const[uplodedFile,setUploadedFile]=useState()

    useEffect(() => {
       
    }, [])

    const initialValues = {
        file:null,
        attachments:null,
        object:''
    }   
    const SUPPORTED_FORMATS=['text/csv'];
    const FILE_SIZE =1024 * 1024
    const validationSchema = Yup.object({
        object: Yup
            .string()
            .required('Required'),
    })
    
    const fileSendValue =(obj,files)=>{

        let formData = new FormData();
        formData.append('file',files)
        console.log('modified formData',formData);
        RequestServerFiles(apiMethods.post, URL_postFilePreview, formData)
            .then((res) => {
                console.log('RequestServer file Submission  response', res);
                if(res.success){
                    console.log(res.data,"inside res success")
                    setUplodedData(res.data) 
                } else{
                    console.log("RequestServer file then error",res.error.message)
                } 
            })
            .catch((error) => {
                console.log('RequestServer file form Submission  error', error);
            })
    }

     const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
      
      }
      
    return (
    
        <div>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>Data Loader </h3>                 
            </div>
        {uplodedData.length>0 ? 
        
        <>
        <PreviewDataload  data={uplodedData} file={uplodedFile} ModalClose={handleModal} object={object}/>
        </> :
     
           
     
        <Grid item xs={12} style={{ margin: "20px" }}>
            

            <Formik
                initialValues={initialValues}
               validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
            >
                 {(props) => {
                        const {values,dirty, isSubmitting, handleChange,handleSubmit,handleReset,setFieldValue,errors,touched,} = props;
                   
                    return (
                        <>
                            <Form className="my-form">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={12}>

                                        <label htmlFor="file">Import csv File</label>
                                        <Field name="file" type="file"
                                        className="form-input"
                                        accept=".csv"
                                        onChange={(event)=>{
                                            setFieldValue("attachments", (event.target.files[0]));
                                            setUploadedFile(event.target.files[0])
                                             fileSendValue(values.object,(event.target.files[0]))
                                        }} 
                                        />
                                         <div style={{ color: 'red' }}>
                                                <ErrorMessage name="file" />
                                            </div>
                                    </Grid>
                                </Grid>
                            </Form>
                        </>
                    )
                }}
            </Formik>


        </Grid>
         }
        </div>
    
    )
    
     
    
}
export default ModalFileUpload