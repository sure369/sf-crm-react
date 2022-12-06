import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CurrencyInput from 'react-currency-input-field';
import { Grid,Button ,Forminput,DialogActions} from "@mui/material";
import { useParams,useNavigate } from "react-router-dom"
import axios from 'axios'
import SimpleSnackbar from "../toast/test";
import "../formik/FormStyles.css"

const url ="http://localhost:4000/api/UpsertUser";

const UserDetailPage = ({item}) => {

    const [singleUser,setsingleUser]= useState(); 
    const location = useLocation();
    const navigate =useNavigate();
    const [showNew, setshowNew] = useState()
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();

    useEffect(()=>{
        console.log('passed record',location.state.record.item);
        setsingleUser(location.state.record.item);       
        setshowNew(!location.state.record.item)
    },[])

    const savedValues = {
        firstName: singleUser?.firstName ?? "",
        lastName:  singleUser?.lastName ?? "",
        username: singleUser?.username ?? "",
        phone:  singleUser?.phone ?? "",
        company:  singleUser?.company ?? "",
        email:  singleUser?.email ?? "",
        role:  singleUser?.role ?? "",
        access:  singleUser?.access ?? "",
        _id:   singleUser?._id ?? "",
    }



    const validationSchema = Yup.object({
        lastName: Yup
        .string()
        .required('Required'),
    email: Yup
        .string()
        .email('invalid Format')
        .required('Required'),
    username: Yup
        .string()
        .email('invalid Format')
        .required('Required'),
    role: Yup
        .string()
        .required('Required'),
    access: Yup
        .string()
        .required('Required'),
    })
    
    const toastCloseCallback = () => {
        setShowAlert(false)
    }

  return (
    <Grid item xs={12} style={{margin:"20px"}}>          
            <div style={{textAlign:"center" ,marginBottom:"10px"}}>
                {
                    showNew ? <h3>New User</h3> : <h3>User Detail Page </h3>
                }
            </div>
           <div>
                <Formik
                    enableReinitialize={true} 
                    initialValues={savedValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        await new Promise((resolve) => setTimeout(resolve, 500));
                        console.log("updated record values", values);  
                        
                        axios.post(url,values)
                        .then((res)=>{
                            console.log('updated record  response',res);
                            navigate(-1);
                        })
                        .catch((error)=> {
                            console.log('updated record error',error);
                          })
                        
                      }}
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
                {
                    showAlert ? <SimpleSnackbar severity={alertSeverity} message={alertMessage} showAlert={showAlert} onClose={toastCloseCallback} /> : <SimpleSnackbar message={showAlert} />
                }

                <Form>
                        <Grid container spacing={2}>
                            
                                    <Grid item xs={6} md={6}>

                                    <label htmlFor="firstName" >First Name</label>
                                    <Field name='firstName' type="text" class="form-input" />
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                         <label htmlFor="lastName" >Last Name<span className="text-danger">*</span> </label>
                                    <Field name='lastName' type="text" class="form-input" />
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="lastName" />
                                    </div>
                                    </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="email">Email <span className="text-danger">*</span> </label>
                                    <Field name="email" type="text" class="form-input" />
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="email" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="username">username<span className="text-danger">*</span> </label>
                                    <Field name="username" type="text" class="form-input" />
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="username" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="phone">phone<span className="text-danger">*</span> </label>
                                    <Field name="phone" type="text" class="form-input" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="role">role <span className="text-danger">*</span> </label>
                                    <Field name="role" as="select" class="form-input">
                                        <option value="">--Select--</option>
                                        <option value="CEO">CEO</option>
                                        <option value="Sales Director"> Sales Director</option>
                                        <option value="Sales Manager">Sales Manager</option>
                                        <option value="Sales Rep">Sales Rep</option>
                                    </Field>
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="role" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="access">Access <span className="text-danger">*</span> </label>
                                    <Field name="access" as="select" class="form-input">
                                        <option value="">--Select--</option>
                                        <option value="Read">Read</option>
                                        <option value="Read/Create"> Read-Create</option>
                                        <option value="Read/Create/Edit">Read-Create-Edit</option>
                                        <option value="Read/Create/Edit/Delete">Read-Create-Edit-Delete</option>
                                    </Field>
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="access" />
                                    </div>
                                </Grid>
                               
                              
                            </Grid>
                            <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>

                                       
                                           {
                                                showNew ?
                                                <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>
                                                    :
                                                    
                                                        <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Update</Button>
                                           }                                      
                                        <Button type="reset" variant="contained" onClick={handleReset} disabled={!dirty || isSubmitting}  >Cancel</Button>
                                        </DialogActions>     
                                       </div>
                                </Form>
                            </>
            )
             }}
                </Formik>
            </div>
        </Grid>   
  )

}
export default UserDetailPage;