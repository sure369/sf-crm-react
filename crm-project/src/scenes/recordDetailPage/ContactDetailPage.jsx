import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
    Grid, Button, DialogActions, Tooltip,
    Modal, Box, Autocomplete, TextField, IconButton, MenuItem
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import EmailModalPage from './EmailModalPage';
import ToastNotification from '../toast/ToastNotification';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import WhatAppModalPage from './WhatsAppModalPage';
import { LeadSourcePickList, NameSalutionPickList } from '../../data/pickLists'
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './Form.css'
import { ContactInitialValues,ContactSavedValues } from '../formik/IntialValues/formValues';
import { RequestServer } from '../api/HttpReq';
import { apiMethods } from '../api/methods';
import { apiCheckObjectPermission } from '../Auth/apiCheckObjectPermission';
import { getLoginUserRoleDept } from '../Auth/userRoleDept';
import NoAccessCard from '../NoAccess/NoAccessCard';
import { OBJECT_API_CONTACT,POST_CONTACT } from '../api/endUrls';

const OBJECT_API = OBJECT_API_CONTACT
const URL_postRecords= POST_CONTACT
const fetchAccountsbyName = `/accountsname?searchKey=`;

const ContactDetailPage = ({ item }) => {

    const [singleContact, setsingleContact] = useState();
    const [accNames, setAccNames] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    const [emailModalOpen, setEmailModalOpen] = useState(false)
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false)

    const[permissionValues,setPermissionValues]=useState({})
    const userRoleDpt =getLoginUserRoleDept(OBJECT_API)
    console.log(userRoleDpt,"userRoleDpt")

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setsingleContact(location.state.record.item);
        setshowNew(!location.state.record.item)
        FetchAccountsbyName('');
        fetchObjectPermissions()
    }, [])

    const fetchObjectPermissions=()=>{
        if(userRoleDpt)
        apiCheckObjectPermission(userRoleDpt)
        .then(res=>{
            console.log(res,"res apiCheckObjectPermission")
            setPermissionValues(res[0].permissions)
        })
        .catch(err=>{
            console.log(err, " error apiCheckObjectPermission task")
            setPermissionValues({})
        })
    }

    const initialValues= ContactInitialValues
    const savedValues= ContactSavedValues(singleContact)

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const validationSchema = Yup.object({
        firstName: Yup
            .string()
            // .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
            .max(30, 'lastName must be less than 15 characters'),
        lastName: Yup
            .string()
            .required('Required')
            // .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
            .min(3, 'lastName must be more than 3 characters')
            .max(30, 'lastName must be less than 15 characters'),
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
            values.fullName = values.firstName + ' ' + values.lastName;
            values.createdBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
            values.modifiedBy = JSON.parse(sessionStorage.getItem('loggedInUser'))

            if (values.dob) {
                values.dob = dobSec;
            }
            if (values.AccountId === '') {
                delete values.AccountId;
            }

        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec
            values.fullName = values.firstName + ' ' + values.lastName;
            values.createdBy = singleContact.createdBy;
            values.modifiedBy = JSON.parse(sessionStorage.getItem('loggedInUser'))

            if (values.dob) {
                values.dob = dobSec;
            }
            if (values.AccountId === '') {
                delete values.AccountId;
            }
        }
        console.log('after change form submission value', values);

        RequestServer(apiMethods.post,URL_postRecords, values)
            .then((res) => {
                console.log('upsert record  response', res);
                setNotify({
                    isOpen: true,
                    message: res.data,
                    type: 'success'
                })               
            })
            .catch((error) => {
                console.log('upsert record error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
            })
            .finally(()=>{
                setTimeout(() => {
                    navigate(-1);
                }, 2000)
            })
    }

    const FetchAccountsbyName = (newInputValue) => {

        RequestServer(apiMethods.post,fetchAccountsbyName + newInputValue)
        .then((res)=>{
            if(res.success){
                if(typeof(res.data)!=='string'){
                    setAccNames(res.data)
                }else{
                    setAccNames([])
                }                
            }else{
                console.log("status error",res.error.message)
            }
        })
        .catch((error)=>{
            console.log("error fetchInventoriesbyName",error)
        })
    }
    const handleFormClose = () => {
        navigate(-1)
    }
    const handlesendEmail = () => {
        setEmailModalOpen(true)
    }
    const setEmailModalClose = () => {
        setEmailModalOpen(false)
    }

    const handlesendWhatsapp = () => {
        setWhatsAppModalOpen(true)
    }

    const setWhatAppModalClose = () => {
        setWhatsAppModalOpen(false)
    }



    return (
        <div className="App" >
            
            <Grid item xs={12} style={{ margin: "20px" }}>
                {
                    permissionValues.read ?
                    <>
                    
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    {
                        showNew ? <h2>New Contact </h2> : <h2>Contact Detail Page </h2>
                    }
                </div>
                <div>
                    <div className='btn-test'>
                        {
                            !showNew && permissionValues.read && permissionValues.create ?
                                <>
                                    <Tooltip title="Send Email">
                                        <IconButton> <EmailIcon sx={{ color: '#DB4437' }} onClick={handlesendEmail} /> </IconButton>
                                    </Tooltip>
                                    {/* <Tooltip title="Whatsapp">
                                        <IconButton> <WhatsAppIcon sx={{ color: '#34A853' }} onClick={handlesendWhatsapp} /> </IconButton>
                                    </Tooltip> */}
                                </>
                                : null
                        }
                    </div>
                </div>
                <div>
                    <Formik
                        enableReinitialize={true}
                        initialValues={showNew ? initialValues : savedValues}
                        validationSchema={validationSchema}
                        onSubmit={(values) => { formSubmission(values) }}
                    >
                        {(props) => {
                        const {values,dirty, isSubmitting, handleChange,handleSubmit,handleReset,setFieldValue,errors,touched,} = props;

                            return (
                                <>
                                    <ToastNotification notify={notify} setNotify={setNotify} />
                                    <Form className="my-form">
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} md={2}>
                                                <label htmlFor="salutation">Salutation  </label>
                                                <Field name="salutation" component={CustomizedSelectForFormik} className="form-customSelect"
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                    {
                                                        NameSalutionPickList.map((i) => {
                                                            return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                        })
                                                    }
                                                </Field>
                                            </Grid>
                                            <Grid item xs={6} md={4}>
                                                <label htmlFor="firstName" >First Name</label>
                                                <Field name='firstName' type="text" class="form-input" 
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="firstName" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="lastName" >Last Name<span className="text-danger">*</span> </label>
                                                <Field name='lastName' type="text" class="form-input" 
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
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
                                                        if (!value) {
                                                            console.log('!value', value);
                                                            setFieldValue("AccountId", '')
                                                            setFieldValue("accountDetails", '')
                                                        } else {
                                                            console.log('value', value);
                                                            setFieldValue("AccountId", value.id)
                                                            setFieldValue("accountDetails", value)
                                                        }
                                                    }}
                                                    onInputChange={(event, newInputValue) => {
                                                        console.log('newInputValue', newInputValue);
                                                        if (newInputValue.length >= 3) {
                                                            FetchAccountsbyName(newInputValue);
                                                        }
                                                        else  if (newInputValue.length === 0) {
                                                            FetchAccountsbyName(newInputValue);
                                                        }
                                                    }}
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                    renderInput={params => (
                                                        // console.log(params,"params")
                                                         <Field component={TextField} {...params} name="AccountId" />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="phone">Phone</label>
                                                <Field name="phone" type="phone" class="form-input" 
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="phone" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                {/* <label htmlFor="dob">Date of Birth</label>
                                                <Field name="dob" type="date" class="form-input" /> */}
                                                <label htmlFor="dob">Date of Birth</label><br />
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        name="dob"
                                                        value={values.dob}
                                                        onChange={(e) => {
                                                            setFieldValue('dob', e)
                                                        }}
                                                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                        renderInput={(params) => <TextField  {...params} style={{width:'100%'}} error={false} />}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="department">Department</label>
                                                <Field name="department" type="text" class="form-input" 
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="email">Email <span className="text-danger">*</span></label>
                                                <Field name="email" type="text" class="form-input" 
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="email" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="leadSource"> Lead Source</label>
                                                <Field name="leadSource" component={CustomizedSelectForFormik} className="form-customSelect"
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                 {
                                                        LeadSourcePickList.map((i) => {
                                                            return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                        })
                                                    }
                                                </Field>
                                            </Grid>
                                            <Grid Grid item xs={6} md={6}>
                                                <label htmlFor="fullAddress">Full Address</label>
                                                <Field as="textarea" name="fullAddress" class="form-input-textarea" style={{width:'100%'}} 
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                            </Grid>
                                            <Grid Grid item xs={6} md={12}>
                                                <label htmlFor="description">Description</label>
                                                <Field as="textarea" name="description" class="form-input-textarea" style={{width:'100%'}} 
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                            </Grid>
                                            {!showNew && (
                                                <>
                                                    <Grid container spacing={2} item xs={12} md={12} direction="row">


                                                 {/* <Grid item xs={6} md={6}>
                                                    <label htmlFor="createdBy" >Created By</label>
                                                    <Field name='createdBy' type="text" class="form-input" disabled />
                                                </Grid>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="modifiedBy" >Modified By</label>
                                                    <Field name='modifiedBy' type="text" class="form-input" disabled />
                                                </Grid> */}
                                                    <Grid item xs={6} md={6}>
                                                        <label htmlFor="createdDate" >Created By</label>
                                                        <Field name='createdDate' type="text" class="form-input" disabled 
                                                          value={values.createdBy +',  '+values.createdDate} />
                                                    </Grid>

                                                    <Grid item xs={6} md={6}>
                                                        <label htmlFor="modifiedDate" >Modified By</label>
                                                        <Field name='modifiedDate' type="text" class="form-input" disabled
                                                          value={values.modifiedBy +',  '+values.modifiedDate}  />
                                                    </Grid>
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
                                                <Button type="reset" variant="contained" onClick={handleFormClose}  >Cancel</Button>
                                            </DialogActions>
                                        </div>
                                    </Form>
                                </>
                            )
                        }}
                    </Formik>
                </div>
                </>
                : <NoAccessCard/>
                }

            </Grid>

            <Modal
                open={emailModalOpen}
                onClose={setEmailModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ backdropFilter: "blur(1px)"}}
           >
                <div className='modal'>
                    <EmailModalPage data={singleContact} handleModal={setEmailModalClose} bulkMail={false} />
                </div>
            </Modal>
            <Modal
                open={whatsAppModalOpen}
                onClose={setWhatAppModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className='modal'>
                    <WhatAppModalPage data={singleContact} handleModal={setWhatAppModalClose} bulkMail={true} />
                </div>
            </Modal>

        </div>


    )

}
export default ContactDetailPage;

