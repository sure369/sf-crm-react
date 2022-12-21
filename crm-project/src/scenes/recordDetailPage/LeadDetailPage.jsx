import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, Forminput, DialogActions } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
import SimpleSnackbar from "../toast/test";
import "../formik/FormStyles.css"
import Divider from '@mui/material/Divider';
import EventForm from '../formik/EventForm';
import NewEventForm from '../formik/NewEvent';

const url = "http://localhost:4000/api/UpsertLead";

const LeadDetailPage = ({ item }) => {

    const [singleLead, setsingleLead] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();
    const[relatedTask,setRelatedTask] = useState([]);

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setsingleLead(location.state.record.item);
        console.log('true', !location.state.record.item);
        setshowNew(!location.state.record.item)
        console.log('lead id', location.state.record.item._id);
        // getTasks(location.state.record.item._id)
    }, [])


    


    const initialValues = {
        salutation: '',
        firstName: '',
        lastName: '',
        fullName: '',
        phone: '',
        leadSource: '',
        industry: '',
        leadStatus: '',
        email: '',
        createdbyId: '',
        createdDate: '',
        modifiedDate: '',

    }


    const savedValues = {
        salutation: singleLead?.salutation ?? "",
        firstName: singleLead?.firstName ?? "",
        lastName: singleLead?.lastName ?? "",
        fullName: singleLead?.fullName ?? "",
        phone: singleLead?.phone ?? "",
        leadSource: singleLead?.leadSource ?? "",
        industry: singleLead?.industry ?? "",
        leadStatus: singleLead?.leadStatus ?? "",
        email: singleLead?.email ?? "",
        createdbyId: singleLead?.createdbyId ?? "",
        createdDate: singleLead?.createdDate ?? "",
        modifiedDate:singleLead?.modifiedDate ?? "",
        _id: singleLead?._id ?? "",
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

        leadStatus: Yup
            .string()
            .required('Required'),
        email: Yup
            .string()
            .email('Invalid email address')
            .required('Required'),
    })

    const formSubmission = (values) => {
        console.log('form submission value',values);
        let d = new Date();
        const formatDate =  [d.getDate(), d.getMonth()+1,d.getFullYear()].join('/')+' '+ [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
      
        if(showNew){
            values.modifiedDate = formatDate;
            values.createdDate = formatDate;
        }
        else if(!showNew){
            values.modifiedDate = formatDate;
        }
        console.log('after change form submission value',values);
       
        axios.post(url, values)
        .then((res) => {
            console.log('upsert record  response', res);
            setShowAlert(true)
            setAlertMessage(res.data)
            setAlertSeverity('success')
            setTimeout(() => {
                navigate(-1)
            }, 2000);

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

    const getTasks =(leadsId)=>{
        console.log('inside get task',leadsId)
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

    const callEvent = (savedValues) => {

        console.log('button click', savedValues);
        let item = savedValues
        navigate('/test1', { state: { record: { item } } })

    }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h3>New Lead</h3> : <h3>Lead Detail Page </h3>
                }
            </div>
            <div style={{ textAlign: "end", marginBottom: "10px" }}>

                {
                    showNew ? null : <button onClick={() => callEvent(savedValues)}>New Event</button>
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
                                            <label htmlFor="phone">Phone</label>
                                            <Field name="phone" type="phone" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="phone" />
                                            </div>
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
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="industry">Industry</label>
                                            <Field name="industry" as="select" class="form-input">
                                                <option value="">--Select--</option>
                                                <option value="Agriculture" >Agriculture</option>
                                                <option value="Banking" >Banking</option>
                                                <option value="Communications" >Communications</option>
                                                <option value="Construction" >Construction</option>
                                                <option value="Consulting" >Consulting</option>
                                                <option value="Education" >Education</option>
                                                <option value="Engineering" >Engineering</option>
                                                <option value="Government" >Government</option>
                                                <option value="Manufacturing" >Manufacturing</option>
                                                <option value="Hospitality" >Hospitality</option>
                                                <option value="Insurance" >Insurance</option>
                                                <option value="Technology" >Technology</option>
                                                <option value="Transportation" >Transportation</option>
                                                <option value="Other" >Other</option>
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="leadStatus"> Lead Status <span className="text-danger">*</span> </label>
                                            <Field name="leadStatus" as="select" class="form-input">
                                                <option value="">--Select--</option>
                                                <option value="open-not contacted">Open-Not Contacted</option>
                                                <option value="working-contacted">Working-Contacted</option>
                                                <option value="closed-converted">Closed-Converted</option>
                                                <option value="closed-not converted">closed-Not Converted</option>
                                            </Field>
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="leadStatus" />
                                            </div>
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
                                    <Divider />

                                    <Divider />

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
export default LeadDetailPage;