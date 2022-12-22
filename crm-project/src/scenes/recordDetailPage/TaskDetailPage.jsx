import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Grid, Button, FormControl, Stack, Alert, DialogActions,
    Autocomplete, TextField
} from "@mui/material";
import axios from 'axios'
import SimpleSnackbar from "../toast/SimpleSnackbar";
import "../formik/FormStyles.css"
import PreviewFile from "../formik/PreviewFile";



const UpsertUrl = "http://localhost:4000/api/UpsertTask";
const fetchAccountUrl = "http://localhost:4000/api/accountsname";
const fetchLeadUrl = "http://localhost:4000/api/LeadsbyName";
const fetchOpportunityUrl = "http://localhost:4000/api/opportunitiesbyName";

const TaskDetailPage = ({ item }) => {

    const [singleTask, setSingleTask] = useState();
    const [showNew, setshowNew] = useState()
    const [url, setUrl] = useState();
    const [relatedRecNames, setRelatedRecNames] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();

    const navigate = useNavigate();
    const fileRef = useRef();
    const location = useLocation();

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setSingleTask(location.state.record.item)
        console.log('true', !location.state.record.item);
        setshowNew(!location.state.record.item)
       
    }, [])

    
    const initialValues = {
        subject: '',
        nameofContact: '',
        realatedTo: '',
        assignedTo: '',
        startDate: '',
        startTime: '',
        EndDate: '',
        EndTime: '',
        description: '',
        attachments: null,
        object: '',
        AccountId: '',
        LeadId: '',
        OpportunityId: '',
        createdbyId: '',
        createdDate: '',
        modifiedDate: '',
    }

    const savedValues = {
        subject: singleTask?.subject ?? "",   
        nameofContact: singleTask?.nameofContact ?? "",
        realatedTo:singleTask?.realatedTo ?? "",
        assignedTo:singleTask?.assignedTo ?? "",
        startDate: singleTask?.startDate ?? "",
        startTime: singleTask?.startTime ?? "",
        EndDate: singleTask?.EndDate ?? "",
        EndTime: singleTask?.EndTime ?? "",
        description: singleTask?.description ?? "",
        attachments: singleTask?.attachments ?? "",
        object: singleTask?.object ?? "",
        leads: singleTask?.leads ?? "",
        AccountId: singleTask?.AccountId ?? "",
        LeadId: singleTask?.LeadId ?? "",
        OpportunityId: singleTask?.OpportunityId ?? "",
        createdbyId: singleTask?.createdbyId ?? "",
        createdDate: singleTask?.createdDate ?? "",
        modifiedDate: singleTask?.modifiedDate ?? "",
        _id: singleTask?._id ?? "",
    }

   
    const validationSchema = Yup.object({
        subject: Yup
            .string()
            .required('Required'),
        attachments: Yup
           .mixed()
           .nullable()
           .notRequired()
        //    .test('FILE_SIZE',"Too big !",(value)=>value <1024*1024)
        //   .test('FILE_TYPE',"Invalid!",(value)=> value && ['image/jpg','image/jpeg','image/gif','image/png'].includes(value.type))
          ,

    })

     const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
        let d = new Date();
        const formatDate = [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/') + ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');

        if (showNew) {
            values.modifiedDate = formatDate;
            values.createdDate = formatDate;
            values.fullName = values.firstName +' '+ values.lastName;
        
            let formData = new FormData();
        formData.append('subject',values.subject);
        formData.append('nameofContact',values.nameofContact);
        formData.append('realatedTo',values.realatedTo);
        formData.append('assignedTo',values.assignedTo); 
        formData.append('startDate',values.startDate);        
        formData.append('startTime',values.startTime);        
        formData.append('EndDate',values.EndDate);        
        formData.append('EndTime',values.EndTime)
        formData.append('description',values.description);        
        formData.append('attachments',values.attachments);        
        formData.append('object',values.object);        
        formData.append('AccountId',values.AccountId);        
        formData.append('LeadId',values.LeadId)
        formData.append('OpportunityId',values.OpportunityId)
        formData.append('createdbyId',values.createdbyId)
        formData.append('createdDate',values.createdDate)      
        formData.append('modifiedDate',values.modifiedDate)

        console.log('modified formData',formData);
        await axios.post(UpsertUrl, formData)
    
            .then((res) => {
                console.log('task form Submission  response', res);
                setShowAlert(true)
                setAlertMessage(res.data)
                setAlertSeverity('success')
                setTimeout(()=>{
                    navigate(-1);
                },1000)
            })
            .catch((error) => {
                console.log('task form Submission  error', error);
                setShowAlert(true)
                setAlertMessage(error.message)
                setAlertSeverity('error')
            })

        }
        else if (!showNew) {
            values.modifiedDate = formatDate;

            let formData = new FormData();
            formData.append('subject',values.subject);
            formData.append('nameofContact',values.nameofContact);
            formData.append('realatedTo',values.realatedTo);
            formData.append('assignedTo',values.assignedTo); 
            formData.append('startDate',values.startDate);        
            formData.append('startTime',values.startTime);        
            formData.append('EndDate',values.EndDate);        
            formData.append('EndTime',values.EndTime)
            formData.append('description',values.description);        
            formData.append('attachments',values.attachments);        
            formData.append('object',values.object);        
            formData.append('AccountId',values.AccountId);        
            formData.append('LeadId',values.LeadId)
            formData.append('OpportunityId',values.OpportunityId)
            formData.append('createdbyId',values.createdbyId)
            formData.append('createdDate',values.createdDate)      
            formData.append('modifiedDate',values.modifiedDate)                  
            formData.append('_id',values._id)
    
            await axios.post(UpsertUrl, formData)
        
                .then((res) => {
                    console.log('task form Submission  response', res);
                    setShowAlert(true)
                    setAlertMessage(res.data)
                    setAlertSeverity('success')
                    setTimeout(()=>{
                        navigate(-1);
                    },1000)
                })
                .catch((error) => {
                    console.log('task form Submission  error', error);
                    setShowAlert(true)
                    setAlertMessage(error.message)
                    setAlertSeverity('error')
                })
        }

       

    }

    const toastCloseCallback = () => {
        setShowAlert(false)
    }

    const callEvent = (e) => {

        let url1 = e == 'Account' ? fetchAccountUrl : e == 'Lead' ? fetchLeadUrl : e == 'Opportunity' ? fetchOpportunityUrl : null

        setUrl(url1)

        FetchObjectsbyName('', url1);
        if (url == null) {
            console.log('url', url);
            setRelatedRecNames([])
        }
    }

    const FetchObjectsbyName = (newInputValue, url) => {

        console.log('passed url', url)
        console.log('new Input  value', newInputValue)


        axios.post(`${url}?searchKey=${newInputValue}`)
            .then((res) => {
                console.log('res Fetch Objects byName', res.data)
                if (typeof (res.data) === "object") {
                    setRelatedRecNames(res.data)
                }
            })
            .catch((error) => {
                console.log('error fetchAccountsbyName', error);
            })
    }

    const handleClosePage =()=>{
        navigate(-1)
    }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h3>New Task</h3> : <h3>Task Detail Page </h3>
                }
            </div>

            <Formik
                enableReinitialize={true}
                initialValues={showNew?initialValues:savedValues}
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
                            {
                                showAlert ? <SimpleSnackbar severity={alertSeverity} message={alertMessage} showAlert={showAlert} onClose={toastCloseCallback} /> : <SimpleSnackbar />
                            }

                            <Form>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="subject">Subject  <span className="text-danger">*</span></label>
                                        <Field name="subject" as="select" class="form-input">
                                            <option value=""> </option>
                                            <option value="call"> Call</option>
                                            <option value="email"> Email</option>
                                            <option value="meeting"> Meeting</option>
                                            <option value="send Quote"> Send Quote</option>
                                        </Field>

                                        <div style={{ color: 'red' }}>
                                            <ErrorMessage name="subject" />
                                        </div>
                                    </Grid>
                                    {/* <Grid item xs={6} md={6}>
                                        <label htmlFor="taskName">Task Name </label>
                                        <Field name="taskName" type="text" class="form-input">
                                    </Field>
                                    </Grid> */}
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="object">object  </label>
                                        <Field name="object" as="select" class="form-input"
                                            onChange={(e) => {
                                                console.log('value', e.target.value)
                                                callEvent(e.target.value)
                                                setFieldValue('object', e.target.value)
                                            }}
                                        >
                                            <option value=""></option>
                                            <option value="Lead">Lead</option>
                                            <option value="Opportunity">Opportunity</option>
                                            <option value="Account">Account</option>
                                        </Field>
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="realatedTo"> Realated To  </label>
                                        <Autocomplete
                                            name="realatedTo"
                                            options={relatedRecNames}
                                            value={values.realatedTo}

                                            getOptionLabel={option => option.leadName || option.accountName || option.opportunityName || ''}

                                            isOptionEqualToValue={(option, value) =>
                                                option.id === value
                                            }
                                            onChange={(e, value) => {

                                                console.log('inside onchange', values.object);
                                                if (values.object == 'Account') {
                                                    setFieldValue('AccountId', value.id)
                                                } else if (values.object == 'Opportunity') {
                                                    setFieldValue('OpportunityId', value.id)
                                                } else if (values.object == 'Lead') {
                                                    setFieldValue('LeadId', value.id)
                                                }
                                                //    setFieldValue()
                                                setFieldValue("realatedTo", value || '')

                                            }}

                                            onInputChange={(event, newInputValue) => {
                                                console.log('inside on Input Change', values.object);
                                                console.log('newInputValue', newInputValue);

                                                FetchObjectsbyName(newInputValue, url)
                                                // FetchAccountsbyName(newInputValue);

                                            }}
                                            renderInput={params => (
                                                <Field component={TextField} {...params} name="realatedTo" />
                                            )}

                                        />



                                    </Grid>
                                  
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="assignedTo">assignedTo  </label>
                                        <Field name="assignedTo" type="text" class="form-input" />
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="startDate">startDate   </label>
                                        <Field name="startDate" type="date" class="form-input"
                                        
                                            onChange={(event) => {
                                                console.log('inside date change', event.target.value);
                                                var dateFormatConvert = new Date(event.target.value);
                                                var dateSeconds = dateFormatConvert.getTime()
                                                console.log('dateSeconds', dateSeconds);

                                                var secondsFormat = new Date(dateSeconds).toUTCString()
                                                console.log('seconds format', secondsFormat)

                                                console.log('string convert', new Date(secondsFormat).toISOString())



                                                setFieldValue("startDate", event.target.value);

                                            }}

                                        />
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="startTime">startTime   </label>
                                        <Field name="startTime" type="time" class="form-input" />
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="EndDate">EndDate   </label>
                                        <Field name="EndDate" type="date" class="form-input" />
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="EndTime">EndTime   </label>
                                        <Field name="EndTime" type="time" class="form-input" />
                                    </Grid>
                                    <Grid item xs={12} md={12}>

                                        <label htmlFor="attachments">attachments</label>
                                        
                                        <Field name="attacgments" type="file"
                                        className="form-input"
                                        onChange={(event)=>{
                                            setFieldValue("attachments", (event.currentTarget.files[0]));
                                        }} 
                                        />
                                        {/* <input id="attachments" name="attachments" type="file"
                                            ref={fileRef}
                                            onChange={(event) => {
                                                setFieldValue("attachments", (event.target.files[0]));
                                            }} className="form-input" /> */}
                                           
                                           {/*  reader.readAsDataURL */}

                                        {/* {values.attachments && <PreviewFile file={values.attachments} />} */}

                                        <div style={{ color: 'red' }}>
                                            <ErrorMessage name="attachments" />
                                        </div>
                                    </Grid>
                                    
                                    <Grid item xs={12} md={12}>
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
                                        <Button type="reset" variant="contained" onClick={handleClosePage}  >Cancel</Button>

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
export default TaskDetailPage

