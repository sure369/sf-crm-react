import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Button, DialogActions, } from "@mui/material";
import axios from 'axios'
import "../formik/FormStyles.css"
import Notification from '../toast/Notification';

const urlSendEmailbulk = "http://localhost:4000/api/bulkemail"

const EmailModalPage = ({ data, handleModal, bulkMail }) => {

    const [parentRecord, setParentRecord] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // notification
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    useEffect(() => {
        console.log('data', data);
        console.log('bulkMail', bulkMail);
        setParentRecord(data)

    }, [])

    const initialValues = {
        subject: '',
        htmlBody: '',
        recordsData: '',
        attachments: ''
    }

    const validationSchema = Yup.object({
        subject: Yup
            .string()
            .required('Required'),
        htmlBody: Yup
            .string()
            .required('Required')
        ,
    })

    const onebyoneMail=(values,element)=>{
        console.log('values',values);
        console.log('element',element)

        let mergeBody = `Hai ${element.fullName},`+ '\n'+"\n"+ values.htmlBody

        let formData = new FormData();
        formData.append('subject', values.subject);
        formData.append('htmlBody', mergeBody);
        formData.append('emailId',element.email)
        // formData.append('recordsData', JSON.stringify(element));
        formData.append('file', values.attachments);

        axios.post(urlSendEmailbulk, formData)
            .then((res) => {
                console.log('email send res', res)
                setNotify({
                    isOpen: true,
                    message: res.data,
                    type: 'success'
                })
                setTimeout(() => {
                    handleModal(false)
                }, 2000)
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

    const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
     
        values.recordsData = parentRecord;

        let arr = [];
        arr.push((values.recordsData));
        console.log('arr', arr);
        let RecordConvert = (values.recordsData.length > 0 ? (values.recordsData) : (arr))
     
        RecordConvert.forEach(element => {
            onebyoneMail(values,element)
        });

        
    }

    return (
        <>
            <Grid item xs={12} style={{ margin: "20px" }}>
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <h3>New Email</h3>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
                >
                    {(props) => {
                        const {
                            isSubmitting, setFieldValue
                        } = props;

                        return (
                            <>

                                <Form>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={12}>
                                            <label htmlFor="subject">Subject  <span className="text-danger">*</span></label>
                                            <Field name="subject" type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="subject" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <label htmlFor="htmlBody">Email Body <span className="text-danger">*</span> </label>
                                            <Field name="htmlBody" as="textarea" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="htmlBody" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <label htmlFor="attachments">Attachments</label>
                                            <input id="attachments" name="attachments" type="file"

                                                onChange={(event) => {
                                                    console.log('event', event.target.files[0]);
                                                    setFieldValue("attachments", event.target.files[0]);
                                                }} className="form-input" />

                                        </Grid>
                                    </Grid>
                                    <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>

                                            <Button type='success' variant="contained" color="secondary" disabled={isSubmitting} >Send</Button>

                                            <Button type="reset" variant="contained" onClick={(e) => handleModal(false)} >Cancel</Button>

                                        </DialogActions>
                                    </div>
                                </Form>
                            </>
                        )
                    }}
                </Formik>
            </Grid>

            <Notification notify={notify} setNotify={setNotify} />
        </>
    )
}
export default EmailModalPage

