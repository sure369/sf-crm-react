import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, Forminput, DialogActions, Autocomplete, TextField } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
import SimpleSnackbar from "../toast/SimpleSnackbar";
import "../formik/FormStyles.css"

const url = "http://localhost:4000/api/UpsertContact";
const fetchAccountsbyName = "http://localhost:4000/api/accountsname";
const urlSendEmail="http://localhost:4000/api/email"

const ContactDetailPage = ({ item }) => {

    const [singleContact, setsingleContact] = useState();
    const [accNames, setAccNames] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setsingleContact(location.state.record.item);

        setshowNew(!location.state.record.item)
        // fetchAccountsName();     
        FetchAccountsbyName('');
    }, [])



    const initialValues = {
        AccountId: "",
        salutation: '',
        firstName: '',
        lastName: '',
        fullName:'',
        dob:'',
        phone: '',
        department: '',
        leadSource: '',
        email: '',
        fullAddress: '',
        description: '',
        createdbyId: '',
        createdDate: '',
        modifiedDate: '',
    }

    const savedValues = {
        AccountId: singleContact?.AccountId ?? "",
        salutation: singleContact?.salutation ?? "",
        firstName: singleContact?.firstName ?? "",
        lastName: singleContact?.lastName ?? "",
        fullName:singleContact?.fullName ?? "",
        phone: singleContact?.phone ?? "",
        dob:new Date(singleContact?.dob).getUTCFullYear()
        + '-' +  ('0'+ (new Date(singleContact?.dob).getUTCMonth() + 1)).slice(-2) 
        + '-' + ('0'+ ( new Date(singleContact?.dob).getUTCDate())).slice(-2) ||'',

         department: singleContact?.department ?? "",
        leadSource: singleContact?.leadSource ?? "",
        email: singleContact?.email ?? "",
        fullAddress: singleContact?.fullAddress ?? "",
        description: singleContact?.description ?? "",
        createdbyId: singleContact?.createdbyId ?? "",
        createdDate:   new Date(singleContact?.createdDate).toLocaleString(),
        modifiedDate:  new Date(singleContact?.modifiedDate).toLocaleString(),
        _id: singleContact?._id ?? "",
        accountDetails: singleContact?.accountDetails ??"",
    }
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
 
    const validationSchema = Yup.object({
        firstName: Yup
            .string()
            .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
            .max(15, 'lastName must be less than 15 characters'),
        lastName: Yup
            .string()
            .required('Required')
            .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
            .min(3, 'lastName must be more than 3 characters')
            .max(15, 'lastName must be less than 15 characters'),
        phone: Yup
            .string()
            .matches(phoneRegExp, 'Phone number is not valid')
            .min(10, "Phone number must be 10 characters, its short")
            .max(10, "Phone number must be 10 characters,its long"),

        email: Yup
            .string()
            .email('Invalid email address')
            .required('Required'),
    })

    const formSubmission = (values) => {

        console.log('form submission value', values);

            let dateSeconds = new Date().getTime();
            let createDateSec = new Date(values.createdDate).getTime()
            let dobSec = new Date(values.dob).getTime()

        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.fullName = values.firstName +' '+ values.lastName;
        
           
            if( values.dob){
                values.dob =dobSec;
            } 
            if (values.AccountId === '' ) {   
                delete values.AccountId; 
            }

        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate =createDateSec
            values.fullName = values.firstName +' '+ values.lastName;
            if( values.dob){
                values.dob =dobSec;
            }
            if (values.AccountId === '' ) {   
                delete values.AccountId; 
            }
        }
        console.log('after change form submission value', values);

        axios.post(url, values)
            .then((res) => {
                console.log('upsert record  response', res);
                setShowAlert(true)
                setAlertMessage(res.data)
                setAlertSeverity('success')
                setTimeout(() => {
                    navigate(-1);
                }, 2000)

            })
            .catch((error) => {
                console.log('upsert record error', error);
                setShowAlert(true)
                setAlertMessage(error.message)
                setAlertSeverity('error')
            })
    }

    const toastCloseCallback = () => {
        setShowAlert(false)
    }

    const FetchAccountsbyName = (newInputValue) => {

        axios.post(`${fetchAccountsbyName}?searchKey=${newInputValue}`)
            .then((res) => {
                console.log('res fetchAccountsbyName', res.data)
                if (typeof (res.data) === "object") {
                    setAccNames(res.data)
                }
            })
            .catch((error) => {
                console.log('error fetchAccountsbyName', error);
            })
    }
    const handleFormClose =()=>{
        navigate(-1)
    }
    const handlesendEmail =()=>{
        console.log('handlesendEmail',singleContact.email);
        console.log('urlSendEmail',urlSendEmail);
        if(singleContact.email !=''){
            axios.post(urlSendEmail,singleContact)
            .then((res)=>{
                console.log('email send res',res)
            })  
        .catch((error)=>{
            console.log('email send error',error);
        })      }
     
       
    }

    return (
        <div className="App" >
            <Grid item xs={12} style={{ margin: "20px" }}>
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    {
                        showNew ? <h3>New Contact </h3> : <h3>Contact Detail Page </h3>
                    }
                </div>
                <div>
                    {
                        !showNew ? <Button variant="contained" color="secondary" onClick={handlesendEmail}>Send Email</Button> :''
                    }
                    
                </div>
                <div>
                    <Formik
                        enableReinitialize={true}
                        initialValues={showNew ? initialValues : savedValues}
                        validationSchema={validationSchema}
                        onSubmit={(values) => { formSubmission(values) }}
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
                                                <Field name="salutation" as="select" class="form-input">
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
                                                <Field name='firstName' type="text" class="form-input" />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="firstName" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="lastName" >Last Name<span className="text-danger">*</span> </label>
                                                <Field name='lastName' type="text" class="form-input" />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="lastName" />
                                                </div>
                                            </Grid>
                                            {!showNew && (
                                            <>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="fullName" >Full Name</label>
                                                    <Field name='fullName' type="text" class="form-input" disabled
                                                    />
                                                </Grid>
                                            </>
                                            )}
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="AccountId">Account Name </label>
                                                <Autocomplete
                                                    name="AccountId"
                                                    options={accNames}
                                                    value={values.accountDetails}
                                                    getOptionLabel={option => option.accountName || ''}
                                                    onChange={(e, value) => {
                                                        if(!value){                                
                                                            console.log('!value',value);
                                                            setFieldValue("AccountId",'')
                                                            setFieldValue("accountDetails",'')
                                                        }else{
                                                            console.log('value',value);
                                                            setFieldValue("AccountId",value.id)
                                                            setFieldValue("accountDetails",value)
                                                        }
                                                    }}
                                                    onInputChange={(event, newInputValue) => {
                                                        console.log('newInputValue', newInputValue);

                                                        if (newInputValue.length >= 3) {
                                                            FetchAccountsbyName(newInputValue);
                                                        }                                                    
                                                    }}
                                                    renderInput={params => (
                                                        <Field component={TextField} {...params} name="AccountId" />
                                                    )}
                                                />

                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="phone">Phone</label>
                                                <Field name="phone" type="phone" class="form-input" />
                                                <div style={{ color: 'red' }}>
                                                <ErrorMessage name="phone" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="dob">Date of Birth</label>
                                                <Field name="dob" type="date" class="form-input" />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="department">Department</label>
                                                <Field name="department" type="text" class="form-input" />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="email">Email <span className="text-danger">*</span></label>
                                                <Field name="email" type="text" class="form-input" />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="email" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="leadSource"> lead Source</label>
                                                <Field name="leadSource" as="select" class="form-input">
                                                    <option value="">--Select--</option>
                                                    <option value="web">Web</option>
                                                    <option value="phone Inquiry">phone Inquiry</option>
                                                    <option value="Partner Referral">Partner Referral</option>
                                                    <option value="Purchased List">Purchased List</option>
                                                    <option value="other">Other</option>
                                                </Field>
                                            </Grid>
                                         
                                            <Grid Grid item xs={6} md={6}>
                                                <label htmlFor="fullAddress">fullAddress</label>
                                                <Field as="textarea" name="fullAddress" class="form-input" />
                                            </Grid>

                                            <Grid Grid item xs={6} md={12}>
                                                <label htmlFor="description">Description</label>
                                                <Field as="textarea" name="description" class="form-input" />
                                            </Grid>

                                         

                                            {!showNew && (
                                                <>
                                                    <Grid item xs={6} md={6}>                                                       
                                                        <label htmlFor="createdDate" >created Date</label>
                                                        <Field name='createdDate' type="text" class="form-input" disabled />
                                                    </Grid>

                                                    <Grid item xs={6} md={6}>                                                        
                                                        <label htmlFor="modifiedDate" >Modified Date</label>
                                                        <Field name='modifiedDate' type="text" class="form-input" disabled />
                                                    </Grid>
                                                </>
                                            )}
                                        </Grid>
                                        <div className='action-buttons'>
                                            <DialogActions sx={{ justifyContent: "space-between" }}>


                                                {
                                                    showNew ?
                                                        <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>
                                                        :

                                                        <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Update</Button>
                                                }
                                                <Button type="reset" variant="contained" onClick={handleFormClose}  >Cancel</Button>
                                            </DialogActions>
                                        </div>
                                    </Form>
                                </>
                            )
                        }}
                    </Formik>
                </div>
            </Grid>
        </div>
    )

}
export default ContactDetailPage;