import React, { useEffect, useState, useRef ,useCallback } from "react";
import { Formik, Form, Field, ErrorMessage,useField } from "formik";
import * as Yup from "yup";
import {
    Grid, Button, FormControl, Stack, Alert, DialogActions,
    Autocomplete, TextField,Table
} from "@mui/material";
import axios from 'axios'
// import "../formik/FormStyles.css"
import '../recordDetailPage/Form.css'
import PreviewDataload from "./PreviewUpsert";

const generatePreview =`${process.env.REACT_APP_SERVER_URL}/generatePreview`;

const ModalFileUpload = ({ item, handleModal }) => {

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
        
        // file:Yup.mixed()
        // .required('Required')
        //         .test(
        //             "fileSize",
        //             "File is too large",
        //             value => !value || (value && value.size <= FILE_SIZE)
        //         )
        //         .test(
        //             "fileFormat",
        //             "Unsupported Format",
        //             value => !value || (value => value && SUPPORTED_FORMATS.includes(value.type))
        //         )
                        
       

    })
    
    const fileSendValue =(obj,files)=>{

        let formData = new FormData();
        formData.append('file',files)
        console.log('modified formData',formData);
         axios.post(generatePreview, formData)
    
            .then((res) => {
                console.log(' Submission  response', res.data);   
                setUplodedData(res.data) 

            })
            .catch((error) => {
                console.log('task form Submission  error', error);
            })
    }

     const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
      
      }
      
    return (
    
        <div>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>Data Loader</h3>                 
            </div>
        {uplodedData.length>0 ? 
        
        <>
        <PreviewDataload  data={uplodedData} file={uplodedFile} ModalClose={handleModal}/>
        </> :
     
           
     
        <Grid item xs={12} style={{ margin: "20px" }}>
            

            <Formik
                initialValues={initialValues}
               validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
            >
                {(props) => {
                    const {
                        values,
                        dirty,
                        isSubmitting,
                        handleChange,
                        handleSubmit,
                        handleReset,
                        setFieldValue,
                    } = props;

                   
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