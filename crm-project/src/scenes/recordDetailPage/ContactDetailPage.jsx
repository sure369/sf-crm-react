import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CurrencyInput from 'react-currency-input-field';
import { Grid,Button ,FormControl} from "@mui/material";
import { useParams,useNavigate } from "react-router-dom"
import axios from 'axios'
import SimpleSnackbar from "../toast/test";
import "../formik/FormStyles.css"

const url ="http://localhost:4000/api/UpsertContact";
const fetchAccountsUrl = "http://localhost:4000/api/accountsname";

const ContactDetailPage = ({item}) => {

    const [singleContact,setsingleContact]= useState(); 
    const[accNames,setAccNames]= useState([]);
    const location = useLocation();
    const navigate =useNavigate();
    const [showNew, setshowNew] = useState()
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();

    useEffect(()=>{
        console.log('passed record',location.state.record.item);
        setsingleContact(location.state.record.item); 
        setshowNew(!location.state.record.item) 
        fetchAccountsName();  
    },[])

    const fetchAccountsName = () => {
        axios.post(fetchAccountsUrl)
            .then((res) => {
                console.log('res fetchAccountsUrl', res.data)

                setAccNames(res.data)

            })
            .catch((error) => {
                console.log('error fetchAccountsUrl', error);
            })
    }
    const savedValues = {
        accountName: singleContact?.accountName ?? "",
        salutation:  singleContact?.salutation ?? "",
        firstName:  singleContact?.firstName ?? "",
        lastName:  singleContact?.lastName ?? "",
        dop: singleContact?.dop ?? "",
        phone:  singleContact?.phone ?? "",
        department:  singleContact?.department ?? "",
        leadSource:  singleContact?.leadSource ?? "",
        email:  singleContact?.email ?? "",
        file:singleContact?.file ?? "",
        mailingAddress:  singleContact?.mailingAddress ?? "",
        description:  singleContact?.description ?? "",
        createdbyId:  singleContact?.createdbyId ?? "",
        createdDate: singleContact?.createdDate ?? "",
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
    
    const toastCloseCallback = () => {
        setShowAlert(false)
    }

    return (
        <div className="container mb-10">
            <div className="col-lg-12 text-center mb-3">
                {
                    showNew ? <h3>New Contact </h3> : <h3>Contact Detail Page </h3>
                }
            </div>
            <div class="container overflow-hidden ">
                <Formik
                    enableReinitialize={true} 
                    initialValues={savedValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        await new Promise((resolve) => setTimeout(resolve, 500));
                        console.log("upsert record values", values);  
                        
                        axios.post(url,values)
                        .then((res)=>{
                            console.log('upsert record  response',res);
                            setShowAlert(true)
                            setAlertMessage(res.data)
                            setAlertSeverity('success')
                            navigate(-1);
                        })
                        .catch((error)=> {
                            console.log('upsert record error',error);
                            setShowAlert(true)
                            setAlertMessage(error.message)
                            setAlertSeverity('error') 
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
                                <Grid Grid item xs={6} md={6}>
                                    <label htmlFor="files">File</label>          
                                    <input id="file" name="file" type="file" multiple onChange={(event) => {
                                    setFieldValue("file", event.currentTarget.files);
                                    }} className="form-control" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="date">date</label>
                                    <Field name="date" type="date" class="form-control" />
                                </Grid>
                                <Grid Grid item xs={6} md={12}>
                                    <label htmlFor="description">Description</label>
                                    <Field as="textarea" name="description" class="form-control" />
                                </Grid>
                                 <div>
                                           {
                                                showNew ?
                                                    <Grid item xs={12} md={12}>
                                                        <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>
                                                        <Button type="reset" variant="contained" onClick={handleReset} disabled={!dirty || isSubmitting} >Cancel</Button>
                                                    </Grid>
                                                    :
                                                    <Grid item xs={12} md={12}>
                                                        <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Update</Button>
                                                        <Button type="reset" variant="contained" onClick={handleReset} disabled={!dirty || isSubmitting} >Cancel</Button>
                                                    </Grid>

                                            } 
                                        </div>
                            </Grid>

                </Form>
                </>
            )
             }}
                </Formik>
            </div>
        </div>   
  )

}
export default ContactDetailPage;