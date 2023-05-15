import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
    Grid, Button, Forminput, DialogActions, MenuItem,
    TextField, Autocomplete, Select,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import ToastNotification from '../toast/ToastNotification';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { UserAccessPicklist, UserRolePicklist } from '../../data/pickLists';
import './Form.css'
import { RequestServer } from '../api/HttpReq';
import { UserInitialValues,UserSavedValues } from '../formik/IntialValues/formValues';

const url = `/UpsertUser`;
const fetchUsersbyName = `/usersbyName`
const urlSendEmailbulk = `/bulkemail`

const UserDetailPage = ({ item }) => {

    const [singleUser, setsingleUser] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [usersRecord, setUsersRecord] = useState([])

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setsingleUser(location.state.record.item);
        setshowNew(!location.state.record.item)
        // FetchUsersbyName('')
    }, [])

    const initialValues=UserInitialValues
    const savedValues=UserSavedValues(singleUser)

    // const initialValues = {
    //     firstName: '',
    //     lastName: '',
    //     fullName: '',
    //     userName: '',
    //     email: '',
    //     phone: '',
    //     role: '',
    //     access: '',
    //     createdbyId: '',
    //     createdDate: '',
    //     modifiedDate: '',
    // }

    // const savedValues = {
    //     firstName: singleUser?.firstName ?? "",
    //     lastName: singleUser?.lastName ?? "",
    //     fullName: singleUser?.fullName ?? "",
    //     userName: singleUser?.userName ?? "",
    //     email: singleUser?.email ?? "",
    //     phone: singleUser?.phone ?? "",
    //     role: singleUser?.role ?? "",
    //     access: singleUser?.access ?? "",
    //     password:singleUser?.password ?? "",
    //     createdbyId: singleUser?.createdbyId ?? "",
    //     createdDate:  new Date(singleUser?.createdDate).toLocaleString(),
    //     modifiedDate: new Date(singleUser?.modifiedDate).toLocaleDateString(),
    //     _id: singleUser?._id ?? "",
    // }

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const validationSchema = Yup.object({
        lastName: Yup
            .string()
            .required('Required'),
        email: Yup
            .string()
            .email('invalid Format')
            .required('Required'),
        phone: Yup
            .string()
            .matches(phoneRegExp, 'Phone number is not valid')
            .min(10, "Phone number must be 10 characters, its short")
            .max(10, "Phone number must be 10 characters,its long"),

            // userName: Yup
            // .string()
            // .email('invalid Format')
            // .required('Required'),
        // role: Yup
        //     .string()
        //     .required('Required'),
        // access: Yup
        //     .string()
        //     .required('Required'),
    })

    const sendInviteEmail=(values)=>{

        const obj ={
            emailId:`${values.email}`,
            subject:'Welcome to CloudDesk CRM',
            htmlBody: ` Dear ${values.fullName}, `+'\n'+'\n'+
            `Welcome to Clouddesk CRM.`  +'\n'+'\n'+

            `Your UserName is ${values.userName}` +'\n'+'\n'+
            
            `To generate your ClouDesk-CRM password, click here ${process.env.REACT_APP_FORGOT_EMAIL_LINK} `  + '\n'+'\n'+
            
            `Note this Link will expire in 4 days.` +'\n'+'\n'+

            `if you have any trouble logging in, write to us at ${process.env.REACT_APP_ADMIN_EMAIL_ID}`+ '\n'+'\n'+

            `Thanks and Regards, `+ '\n'+
            `Clouddesk.`
        }
        console.log(obj,"sendInviteEmail")

        let formData = new FormData();
        formData.append('subject', obj.subject);
        formData.append('htmlBody', obj.htmlBody);
        formData.append('emailId',obj.emailId)
        // formData.append('file', values.attachments);

        RequestServer("post",urlSendEmailbulk,formData)
        .then((res)=>{
            console.log("eamil res",res.data)
            if(res.success){
                setNotify({
                    isOpen: true,
                    message: "Mail sent Succesfully",
                    type: 'success'
                })
            }
            else{
                setNotify({
                    isOpen: true,
                    message: res.error.message,
                    type: 'error'
                })
            }            
        })
        .catch((error) => {
            console.log('email send error', error);
            setNotify({
                isOpen: true,
                message: error.message,
                type: 'error'
            })
        })  
    }

    const formSubmission = (values) => {

        console.log('form submission value', values);
        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()

        values.userName=values.email;
        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.fullName = values.firstName + ' ' + values.lastName;
            values.createdBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
            values.modifiedBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec;
            values.fullName = values.firstName + ' ' + values.lastName;
            
            values.createdBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
            values.modifiedBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
        }
        console.log('after change form submission value', values);

        RequestServer("post",url, values)
            .then((res) => {
                console.log('upsert record  response', res);
                if(res.success){
                    setNotify({
                        isOpen: true,
                        message: res.data.content,
                        type: "success"
                    })
                    if(showNew){
                        sendInviteEmail(values)
                    }
                    // sendInviteEmail(values)
                }else{
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: "error"
                    })
                }
            })
            .catch((error) => {
                console.log('upsert record  error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
            })
            .finally(()=>{
                setTimeout(()=>{
                    navigate(-1)
                },2000)
            })
    }

    const handleFormClose = () => {
        navigate(-1)
    }

    // const FetchUsersbyName = (inputValue) => {
    //     console.log('inside FetchLeadsbyName fn');
    //     console.log('newInputValue', inputValue)
    //     RequestServer(`${fetchUsersbyName}?searchKey=${inputValue}`)
    //         .then((res) => {
    //             console.log('res fetchLeadsbyName', res.data)
    //             if (typeof (res.data) === "object") {
    //                 setUsersRecord(res.data)
    //             }
    //         })
    //         .catch((error) => {
    //             console.log('error fetchLeadsbyName', error);
    //         })
    // }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h3>New User</h3> : <h3>User Detail Page </h3>
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
                        const { values, dirty, isSubmitting, handleChange, handleSubmit, handleReset, setFieldValue, errors, touched, } = props;

                        return (
                            <>
                                <ToastNotification notify={notify} setNotify={setNotify} />
                                <Form className='my-form'>
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
                                            <label htmlFor="email">Email <span className="text-danger">*</span> </label>
                                            <Field name="email" type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="email" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="userName">User Name<span className="text-danger">*</span> </label>
                                            <Field name="userName" type="text" class="form-input" value={values.email} readOnly />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="userName" />
                                            </div>
                                        </Grid>


                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="role">Role <span className="text-danger">*</span> </label>
                                            <Field name="role" component={CustomizedSelectForFormik}>
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    UserRolePicklist.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="role" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="access">Access <span className="text-danger">*</span> </label>
                                            <Field name="access" component={CustomizedSelectForFormik}>
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    UserAccessPicklist.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="access" />
                                            </div>
                                        </Grid>

                                        {/* <Grid item xs={6} md={6}>
                                            <label htmlFor="createdbyId">User Name </label>
                                            <Autocomplete
                                                name="createdbyId"
                                                options={usersRecord}
                                                value={values.userDetails}
                                                getOptionLabel={option => option.userName || ''}
                                                onChange={(e, value) => {
                                                    console.log('inside onchange values', value);
                                                    if (!value) {
                                                        console.log('!value', value);
                                                        setFieldValue("createdbyId", '')
                                                        setFieldValue("userDetails", '')
                                                    } else {
                                                        console.log('value', value);
                                                        setFieldValue("createdbyId", value.id)
                                                        setFieldValue("userDetails", value)
                                                    }
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    console.log('newInputValue', newInputValue);
                                                    if (newInputValue.length >= 3) {
                                                        FetchUsersbyName(newInputValue);
                                                    }
                                                    else if (newInputValue.length == 0) {
                                                        FetchUsersbyName(newInputValue);
                                                    }
                                                }}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="createdbyId" />
                                                )}
                                            />
                                        </Grid> */}
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="phone">Phone<span className="text-danger">*</span> </label>
                                            <Field name="phone" type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="phone" />
                                            </div>
                                        </Grid>
                                        {!showNew && (
                                            <>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="createdDate" >Created By</label>
                                                    <Field name='createdDate' type="text" class="form-input" disabled
                                                     value={values.createdBy +',  '+values.createdDate} />
                                                </Grid>

                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="modifiedDate" >Modified By</label>
                                                    <Field name='modifiedDate' type="text" class="form-input" disabled
                                                     value={values.modifiedBy +',  '+values.modifiedDate} />
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                    <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>
                                            {
                                                showNew ?
                                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty}>Save</Button>
                                                    :
                                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty}>Update</Button>
                                            }
                                            <Button type="reset" variant="contained" onClick={handleFormClose}   >Cancel</Button>
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

