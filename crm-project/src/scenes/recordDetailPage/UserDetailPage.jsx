import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CurrencyInput from 'react-currency-input-field';
import { Grid,Button ,FormControl} from "@mui/material";
import { useParams,useNavigate } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'


const url ="http://localhost:4000/api/editUser";

const UserDetailPage = ({item}) => {

    const [singleUser,setsingleUser]= useState(); 
    const location = useLocation();
    const navigate =useNavigate();

    useEffect(()=>{
        console.log('passed record',location.state.record.item);
        setsingleUser(location.state.record.item);       
    })

    const initialValues = {
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
    
  return (
        <div className="container mb-10">
            <div className="col-lg-12 text-center mb-3">
                <h3>User Detail page</h3>
            </div>

            <div class="container overflow-hidden ">

                <Formik
                    enableReinitialize={true} 
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        await new Promise((resolve) => setTimeout(resolve, 500));
                        console.log("updated record values", values);  
                        
                        axios.post(url,values)
                        .then((res)=>{
                            console.log('updated record  response',res);
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
                <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            
                                    <Grid item xs={6} md={6}>

                                    <label htmlFor="firstName" >First Name</label>
                                    <Field name='firstName' type="text" class="form-control" />
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                         <label htmlFor="lastName" >Last Name<span className="text-danger">*</span> </label>
                                    <Field name='lastName' type="text" class="form-control" />
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="lastName" />
                                    </div>
                                    </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="email">Email <span className="text-danger">*</span> </label>
                                    <Field name="email" type="text" class="form-control" />
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="email" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="username">username<span className="text-danger">*</span> </label>
                                    <Field name="username" type="text" class="form-control" />
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="username" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="phone">phone<span className="text-danger">*</span> </label>
                                    <Field name="phone" type="text" class="form-control" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="role">role <span className="text-danger">*</span> </label>
                                    <Field name="role" as="select" class="form-select">
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
                                    <Field name="access" as="select" class="form-select">
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
                               
                                <Grid item xs={12} md={12}>
                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Update</Button>
                                    <Button type="reset" variant="contained" onClick={handleReset}  disabled={!dirty || isSubmitting} >Cancel</Button>
                                </Grid>
                            </Grid>
                </form>
            )
             }}
                </Formik>
            </div>
        </div>   
  )

}
export default UserDetailPage;