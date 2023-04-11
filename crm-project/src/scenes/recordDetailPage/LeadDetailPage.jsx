import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, TextField, Forminput, Autocomplete, DialogActions, MenuItem } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
import "../formik/FormStyles.css"
import ToastNotification from '../toast/ToastNotification';
import { NameSalutionPickList, LeadSourcePickList, IndustryPickList, LeadStatusPicklist ,LeadsDemoPicklist } from '../../data/pickLists';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';


const url = `${process.env.REACT_APP_SERVER_URL}/UpsertLead`;
const fetchUsersbyName = `${process.env.REACT_APP_SERVER_URL}/usersbyName`;

const LeadDetailPage = ({ item }) => {

    const [singleLead, setsingleLead] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()

    const [usersRecord, setUsersRecord] = useState([])
    // notification
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })


    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setsingleLead(location.state.record.item);
        setshowNew(!location.state.record.item)
        // getTasks(location.state.record.item._id)
    }, [])

    const initialValues = {
        
        fullName: '',
        companyName:'',
        phone: '',
        leadSource: '',
        industry: '',
        leadStatus: '',
        email: '',
        linkedinProfile:'',
        location:'',
        appointmentDate:'',
        demo:'',
        remarks:'',
        createdbyId: '',
        createdDate: '',
        modifiedDate: '',
    }
    //app-date
    //demo-pic -- 1,2,final
    //remarks --textarea

    const savedValues = {
       
        fullName: singleLead?.fullName ?? "",
        companyName:singleLead?.companyName ?? "",
        phone: singleLead?.phone ?? "",
        leadSource: singleLead?.leadSource ?? "",
        industry: singleLead?.industry ?? "",
        leadStatus: singleLead?.leadStatus ?? "",
        email: singleLead?.email ?? "",      
        linkedinProfile: singleLead?.linkedinProfile ?? "",
        location: singleLead?.location ?? "",
        appointmentDate: new Date(singleLead?.appointmentDate).getUTCFullYear()
        + '-' + ('0' + (new Date(singleLead?.appointmentDate).getUTCMonth() + 1)).slice(-2)
        + '-' + ('0' + (new Date(singleLead?.appointmentDate).getUTCDate())).slice(-2) ||  singleLead?.appointmentDate,
        demo: singleLead?.demo ?? "",
        remarks: singleLead?.remarks ?? "",
        createdbyId: singleLead?.createdbyId ?? "",
        createdDate: new Date(singleLead?.createdDate).toLocaleString(),
        modifiedDate: new Date(singleLead?.modifiedDate).toLocaleString(),
        _id: singleLead?._id ?? "",
    }

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const validationSchema = Yup.object({
        fullName: Yup
            .string()
            .required('Required')
            .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
            .max(15, 'lastName must be less than 15 characters'),
            companyName: Yup
            .string()
            .required('Required')
            .max(25, 'lastName must be less than 15 characters'),
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
        console.log('form submission value', values);

        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()
        let appointmentDateSec = new Date (values.appointmentDate).getTime()
        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
           values.appointmentDate = appointmentDateSec;
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec;
            values.appointmentDate = appointmentDateSec;
        }
        console.log('after change form submission value', values);

        axios.post(url, values)
            .then((res) => {
                console.log('upsert record  response', res);
                setNotify({
                    isOpen: true,
                    message: res.data,
                    type: 'success'
                })
                setTimeout(() => {
                    navigate(-1);
                }, 2000)

            })
            .catch((error) => {
                console.log('upsert record error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
            })
    }
    const handleFormClose = () => {
        navigate(-1)
    }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h3>New Lead</h3> : <h3>Lead Detail Page </h3>
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
                                <ToastNotification notify={notify} setNotify={setNotify} />
                                <Form>
                                    <Grid container spacing={2}>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="fullName">Full Name<span className="text-danger">*</span></label>
                                            <Field name='fullName' type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="fullName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="companyName" >Company Name<span className="text-danger">*</span> </label>
                                            <Field name='companyName' type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="companyName" />
                                            </div>
                                        </Grid>
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
                                            <label htmlFor="leadSource"> Lead Source</label>
                                            <Field name="leadSource" component={CustomizedSelectForFormik} className="form-customSelect">
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    LeadSourcePickList.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="industry">Industry</label>
                                            <Field name="industry" component={CustomizedSelectForFormik} className="form-customSelect">
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    IndustryPickList.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="leadStatus"> Lead Status <span className="text-danger">*</span> </label>
                                            <Field name="leadStatus" component={CustomizedSelectForFormik} className="form-customSelect">
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    LeadStatusPicklist.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="leadStatus" />
                                            </div>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="linkedinProfile">Linkedin Profile</label>
                                            <Field name="linkedinProfile" type="url" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="location">Location</label>
                                            <Field name="location" type="text" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="appointmentDate">Appointment Date</label>
                                            <Field name="appointmentDate" type="date" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="demo">demo</label>
                                            <Field name="demo" component={CustomizedSelectForFormik} className="form-customSelect">
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    LeadsDemoPicklist.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="remarks">Remarks</label>
                                            <Field name="remarks" as="textarea" class="form-input" />
                                        </Grid>
                                        {!showNew && (
                                            <>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="createdDate" >Created Date</label>
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
    )

}
export default LeadDetailPage;