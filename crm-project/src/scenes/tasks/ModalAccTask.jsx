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

const UpsertUrl = "http://localhost:4000/api/UpsertTask";
const fetchAccountUrl = "http://localhost:4000/api/accountsname";
const fetchLeadUrl = "http://localhost:4000/api/LeadsbyName";
const fetchOpportunityUrl = "http://localhost:4000/api/opportunitiesbyName";

const ModalAccTask = ({ item, handleModal }) => {

    const [taskParentRecord, setTaskParentRecord] = useState();

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setTaskParentRecord(location.state.record.item)

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
        let account = taskParentRecord._id;
        let d = new Date();
        const formatDate = [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/') + ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');

        values.modifiedDate = formatDate;
        values.createdDate = formatDate;
        values.AccountId = account;
        values.object = 'Account'

        let formData = new FormData();
        formData.append('subject', values.subject);
        formData.append('nameofContact', values.nameofContact);
        formData.append('realatedTo', values.realatedTo);
        formData.append('assignedTo', values.assignedTo);
        formData.append('startDate', values.startDate);
        formData.append('startTime', values.startTime);
        formData.append('EndDate', values.EndDate);
        formData.append('EndTime', values.EndTime)
        formData.append('description', values.description);
        formData.append('attachments', values.attachments);
        formData.append('object', values.object);
        formData.append('AccountId', account);
        formData.append('LeadId', values.LeadId)
        formData.append('OpportunityId', values.OpportunityId)
        formData.append('createdbyId', values.createdbyId)
        formData.append('createdDate', values.createdDate)
        formData.append('modifiedDate', values.modifiedDate)

        await axios.post(UpsertUrl, values)

            .then((res) => {
                console.log('task form Submission  response', res);
                setShowAlert(true)
                setAlertMessage(res.data)
                setAlertSeverity('success')
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            })
            .catch((error) => {
                console.log('task form Submission  error', error);
                setShowAlert(true)
                setAlertMessage(error.message)
                setAlertSeverity('error')
            })
    }

    const toastCloseCallback = () => {
        setShowAlert(false)
    }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>New Task</h3>
            </div>

            <Formik
                enableReinitialize={true}
                initialValues={initialValues}
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
                                    <Grid item xs={6} md={4}>
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
                                    <Grid item xs={6} md={4}>
                                        <label htmlFor="assignedTo">assignedTo  </label>
                                        <Field name="assignedTo" type="text" class="form-input" />
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <label htmlFor="startDate">startDate   </label>
                                        <Field name="startDate" type="date" class="form-input" />
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <label htmlFor="startTime">startTime   </label>
                                        <Field name="startTime" type="time" class="form-input" />
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <label htmlFor="EndDate">EndDate   </label>
                                        <Field name="EndDate" type="date" class="form-input" />
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <label htmlFor="EndTime">EndTime   </label>
                                        <Field name="EndTime" type="time" class="form-input" />
                                    </Grid>
                                    <Grid item xs={12} md={12}>

                                        <label htmlFor="attachments">attachments</label>

                                        <Field name="attacgments" type="file"
                                            className="form-input"
                                            onChange={(event) => {
                                                setFieldValue("attachments", (event.currentTarget.files[0]));
                                            }}
                                        />
                                        <div style={{ color: 'red' }}>
                                            <ErrorMessage name="attachments" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <label htmlFor="description">Description</label>
                                        <Field as="textarea" name="description" class="form-input" />
                                    </Grid>
                                </Grid>

                                <div className='action-buttons'>
                                    <DialogActions sx={{ justifyContent: "space-between" }}>

                                        <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>

                                        <Button type="reset" variant="contained" onClick={(e) => handleModal(false)} >Cancel</Button>

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
export default ModalAccTask

