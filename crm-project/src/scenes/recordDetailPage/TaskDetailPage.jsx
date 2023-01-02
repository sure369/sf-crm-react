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


    const [file, setFile] = useState()

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setSingleTask(location.state.record.item)
        console.log('true', !location.state.record.item);
        setshowNew(!location.state.record.item)
        //    console.log('AccountId',location.state.record.item.AccountId)

        //    console.log('OpportunityId',location.state.record.item.OpportunityId)

        //    console.log('LeadId',location.state.record.item.LeadId)
        //    setRealatedValues()
    }, [])

    const setRealatedValues = () => {

        if (singleTask.AccountId) {
            console.log('AccountId', singleTask.AccountId);
        }
        else if (singleTask.OpportunityId) {
            console.log('OpportunityId', singleTask.OpportunityId);

        }
        else if (singleTask.LeadId) {
            console.log('LeadId', singleTask.LeadId);
        }
        else {
            console.log('else')
        }
    }


    const initialValues = {
        subject: '',
        nameofContact: '',
        realatedTo: '',
        assignedTo: '',
        StartDate: '',
        StartTime: '',
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
        realatedTo: singleTask?.realatedTo ?? "",
        assignedTo: singleTask?.assignedTo ?? "",
        StartDate: singleTask?.StartDate ?? "",
        StartTime: singleTask?.StartTime ?? "",
        EndDate: singleTask?.EndDate ?? "",
        EndTime: singleTask?.EndTime ?? "",
        description: singleTask?.description ?? "",
        attachments: singleTask?.attachments ?? "",
        object: singleTask?.object ?? "",
        // leads: singleTask?.leads ?? "",
        // AccountId: singleTask?.AccountId ?? "",
        LeadId: singleTask?.LeadId ?? "",
        // OpportunityId: singleTask?.OpportunityId ?? "",
        createdbyId: singleTask?.createdbyId ?? "",
        createdDate: new Date(singleTask?.createdDate).toLocaleString(),
        modifiedDate: new Date(singleTask?.modifiedDate).toLocaleString(),
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

        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()
        let StartDateSec = new Date(values.StartDate).getTime()
        let EndDateSec = new Date(values.EndDate).getTime()

        if (showNew) {

            console.log('dateSeconds',dateSeconds)
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            if (values.StartDate && values.EndDate) {
                values.StartDate = StartDateSec
                values.EndDate = EndDateSec
            }
            else if (values.StartDate) {
                values.StartDate = StartDateSec
            }
            else if (values.EndDate) {
                values.EndDate = EndDateSec
            }

            let formData = new FormData();
            formData.append('subject', values.subject);
            formData.append('nameofContact', values.nameofContact);
            formData.append('realatedTo', values.realatedTo);
            formData.append('assignedTo', values.assignedTo);
            formData.append('StartDate', values.StartDate);
            formData.append('StartTime', values.StartTime);
            formData.append('EndDate', values.EndDate);
            formData.append('EndTime', values.EndTime)
            formData.append('description', values.description);
            formData.append('attachments', values.attachments);
            formData.append('object', values.object);
            formData.append('createdbyId', values.createdbyId)
            formData.append('createdDate', values.createdDate)
            formData.append('modifiedDate', values.modifiedDate)
            if (values.AccountId != '') {
                formData.append('AccountId', values.AccountId);
            }
            else if (values.OpportunityId != '') {
                formData.append('OpportunityId', values.OpportunityId)
            }
            else if (values.LeadId != '') {
                formData.append('LeadId', values.LeadId)
            }

          
            
            await axios.post(UpsertUrl, values)
            // await axios({
            //     method: 'post',
            //     url: UpsertUrl,
            //     data: formData,
            //     headers: { 'Content-Type': 'multipart/form-data' }
            //   })
           

                .then((res) => {
                    console.log('task form Submission  response', res);
                    setShowAlert(true)
                    setAlertMessage(res.data)
                    setAlertSeverity('success')
                    setTimeout(() => {
                        navigate(-1);
                    }, 1000)
                })
                .catch((error) => {
                    console.log('task form Submission  error', error);
                    setShowAlert(true)
                    setAlertMessage(error.message)
                    setAlertSeverity('error')
                })

        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec

            if (values.StartDate && values.EndDate) {
                values.StartDate = StartDateSec
                values.EndDate = EndDateSec
            }
            else if (values.StartDate) {
                values.StartDate = StartDateSec
            }
            else if (values.EndDate) {
                values.EndDate = EndDateSec
            }

            let formData = new FormData();
            formData.append('subject', values.subject);
            formData.append('nameofContact', values.nameofContact);
            formData.append('realatedTo', values.realatedTo);
            formData.append('assignedTo', values.assignedTo);
            formData.append('StartDate', values.StartDate);
            formData.append('StartTime', values.StartTime);
            formData.append('EndDate', values.EndDate);
            formData.append('EndTime', values.EndTime)
            formData.append('description', values.description);
            formData.append('attachments', values.attachments);
            formData.append('object', values.object);
            formData.append('createdbyId', values.createdbyId)
            formData.append('createdDate', values.createdDate)
            formData.append('modifiedDate', values.modifiedDate)
            formData.append('_id', values._id)
            if (values.object === 'Account') {
                formData.append('AccountId', values.AccountId);
            }
            else if (values.object === 'Opportunity') {
                formData.append('OpportunityId', values.OpportunityId)
            }
            else if (values.object === 'Lead') {
                formData.append('LeadId', values.LeadId)
            }

            await axios.post(UpsertUrl, values)

                .then((res) => {
                    console.log('task form Submission  response', res);
                    setShowAlert(true)
                    setAlertMessage(res.data)
                    setAlertSeverity('success')
                    setTimeout(() => {
                        navigate(-1);
                    }, 1000)
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

        let url1 = e === 'Account' ? fetchAccountUrl : e === 'Lead' ? fetchLeadUrl : e === 'Opportunity' ? fetchOpportunityUrl : null

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

    const handleClosePage = () => {
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
                // initialValues={initialValues}
                initialValues={showNew ? initialValues : savedValues}
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
                                    {/* <Grid item xs={6} md={6}>
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
                                                if (values.object === 'Account') {
                                                    setFieldValue('AccountId', value.id)
                                                } else if (values.object === 'Opportunity') {
                                                    setFieldValue('OpportunityId', value.id)
                                                } else if (values.object === 'Lead') {
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



                                    </Grid> */}

                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="assignedTo">assignedTo  </label>
                                        <Field name="assignedTo" type="text" class="form-input" />
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="StartDate">Start Date   </label>
                                        <Field name="StartDate" type="date" class="form-input" />
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="StartTime">startTime   </label>
                                        <Field name="StartTime" type="time" class="form-input" />
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="EndDate">EndDate   </label>
                                        <Field name="EndDate" type="date" class="form-input" />
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="EndTime">EndTime   </label>
                                        <Field name="EndTime" type="time" class="form-input" />
                                    </Grid>
                                    {/* <Grid item xs={12} md={12}>

                                        <label htmlFor="attachments">attachments</label>

                                        <Field name="attachments" type="file"
                                            className="form-input"
                                            onChange={(event) => {

                                                // var reader = new FileReader();
                                                // var url = reader.readAsDataURL(event.currentTarget.files[0]);
                                                // console.log('url ',url);
                                                console.log('ee', event.currentTarget.files[0]);
                                                setFieldValue("attachments", (event.currentTarget.files[0]));
                                                setFile(URL.createObjectURL(event.currentTarget.files[0]));


                                            }}
                                        />
                                        {
                                            file && <img src={file} />
                                        }

                                                //  <input id="attachments" name="attachments" type="file"
                                                //         ref={fileRef}
                                                //         onChange={(event) => {
                                                        
                                                //             setFieldValue("attachments", (event.target.files[0]));
                                                //         }} className="form-input" />
                                                        
                                                //       reader.readAsDataURL 
                                                //        {values.attachments && <PreviewFile file={values.attachments} />} 

                                        <div style={{ color: 'red' }}>
                                            <ErrorMessage name="attachments" />
                                        </div>
                                    </Grid> */}

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

