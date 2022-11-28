import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CurrencyInput from 'react-currency-input-field';
import { Grid,Button ,FormControl} from "@mui/material";
import { useParams,useNavigate } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'


const url ="http://localhost:4000/api/editContact";

const ContactDetailPage = ({item}) => {

    const [singleContact,setsingleContact]= useState(); 
    const location = useLocation();
    const navigate =useNavigate();

    useEffect(()=>{
        console.log('passed record',location.state.record.item);
        setsingleContact(location.state.record.item);       
    })

    const initialValues = {
        accountName: singleContact?.accountName ?? "",
        lastName:  singleContact?.lastName ?? "",
        dop: singleContact?.dop ?? "",
        phone:  singleContact?.phone ?? "",
        department:  singleContact?.department ?? "",
        leadSource:  singleContact?.leadSource ?? "",
        email:  singleContact?.email ?? "",
        mailingAddress:  singleContact?.mailingAddress ?? "",
        description:  singleContact?.description ?? "",
        _id:   singleContact?._id ?? "",
    }



    const validationSchema = Yup.object({
        lastName: Yup
            .string()
            .required('Required'),
        email: Yup
            .string()
            .email('Invalid email address')
            .required('Required'),
    })
    
  return (
        <div className="container mb-10">
            <div className="col-lg-12 text-center mb-3">
                <h3>Contact Detail page</h3>
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
                                    <Grid item xs={6} md={2}>
                                    <label htmlFor="salutation">Salutation  </label>
                                    <Field name="salutation" as="select" class="form-control">
                                        <option value="">--Select--</option>
                                        <option value="Mr.">Mr.</option>
                                        <option value="Ms.">Ms.</option>
                                        <option value="Mrs.">Mrs.</option>
                                        <option value="Dr.">Dr.</option>
                                        <option value="Prof.">Prof.</option>
                                    </Field>
                                    </Grid>
                                    <Grid item xs={6} md={4}>

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
                                    <label htmlFor="accountName">Account Name </label>
                                    <Field name="accountName" type="text" class="form-control" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="phone">Phone</label>
                                    <Field name="phone" type="phone" class="form-control" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="department">Department</label>
                                    <Field name="department" type="text" class="form-control" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="email">Email <span className="text-danger">*</span></label>
                                    <Field name="email" type="text" class="form-control" />
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="email" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="leadSource"> lead Source</label>
                                    <Field name="leadSource" as="select" class="form-select">
                                        <option value="">--Select--</option>
                                        <option value="web">Web</option>
                                        <option value="phone Inquiry">phone Inquiry</option>
                                        <option value="Partner Referral">Partner Referral</option>
                                        <option value="Purchased List">Purchased List</option>
                                        <option value="other">Other</option>
                                    </Field>
                                </Grid>
                                <Grid Grid item xs={6} md={12}>
                                    <label htmlFor="description">Description</label>
                                    <Field as="textarea" name="description" class="form-control" />
                                </Grid>
                                <Grid item xs={6} md={12} >
                                <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Update</Button>
                                    <Button type="reset" variant="contained" onClick={handleReset}  disabled={!dirty || isSubmitting}>Cancel</Button>
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
export default ContactDetailPage;