import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Grid, Button, FormControl, Stack, Alert, DialogActions,
    Autocomplete, TextField
} from "@mui/material";
import axios from 'axios'
import "../formik/FormStyles.css"
import Papa from 'papaparse';



const UpsertUrl = "http://localhost:4000/api/dataloaderlead";

const allowedExtensions =['csv'];

const DataLoadPage = () => {

    const [data,setData] = useState([]);
    const [error,setError] = useState('');
    const [file,setFile] =useState('');




    useEffect(() => {
     
       
    }, [])

    
    const initialValues = {
        csvFile:null,
        attachement:'',
    }


   
    const validationSchema = Yup.object({
       

    })

     const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
       

        await axios.post(UpsertUrl, values)
    
            .then((res) => {
                console.log('task form Submission  response', res);
              
              
            })
            .catch((error) => {
                console.log('task form Submission  error', error);
               
            })
    }


    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>Upload Files</h3>                 
            </div>

            <Formik
                enableReinitialize={true}
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
                            

                            <Form>
                                <Grid container spacing={2}>
                                    
                                    <Grid item xs={12} md={12}>

                                        <label htmlFor="csvFile">File </label>
                                        
                                        <Field name="csvFile" type="file"
                                        className="form-input"
                                        onChange={(event)=>{
                                            setFieldValue("attachement", (event.currentTarget.files[0]));
                                        }} 
                                        />
                                        <div style={{ color: 'red' }}>
                                            <ErrorMessage name="csvFile" />
                                        </div>
                                    </Grid>
                                   
                                </Grid>

                                <div className='action-buttons'>
                                    <DialogActions sx={{ justifyContent: "space-between" }}>
                                 
                                        <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>
                                                                                      
                                        <Button type="reset" variant="contained" onClick={handleReset} disabled={!dirty || isSubmitting}  >Cancel</Button>

                                    </DialogActions>
                                </div>
                            </Form>
                        </>
                    )
                }}
            </Formik>


        </Grid>
    )

}
export default DataLoadPage

