import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Grid, Button, FormControl, Stack, Alert, DialogActions,
    Autocomplete, TextField, MenuItem
} from "@mui/material";
import { TaskStatus, TaskSubjectPicklist } from "../../data/pickLists";
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ToastNotification from '../toast/ToastNotification';
import '../recordDetailPage/Form.css'
import { RequestServer } from '../api/HttpReq';
import { TaskInitialValues } from '../formik/IntialValues/formValues';
import { apiMethods } from "../api/methods";
import { GET_USER_NAME, POST_EVENT } from "../api/endUrls";


const URL_postRecords = POST_EVENT 
const URL_getUserRecords=GET_USER_NAME

const ModalAccTask = ({ item, handleModal }) => {

    const [taskParentRecord, setTaskParentRecord] = useState();
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [relatedUserRecNames,setRelatedUserRecords]=useState([])
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setTaskParentRecord(location.state.record.item)
        fetchUserNames('')
    }, [])


    const fetchUserNames=(newInputValue)=>{
        RequestServer(apiMethods.get,URL_getUserRecords+newInputValue)
        .then(res=>{
            console.log(res,"api res fetchUserNames")
            if(typeof(res.data)==='object'){
                setRelatedUserRecords(res.data)
            }else{                
            setRelatedUserRecords([])
            }
        })
        .catch(err=>{
            console.log(err,"api error fetchUserNames")
            setRelatedUserRecords([])
        })
    }

    const initialValues = TaskInitialValues

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
        let StartDateSec = new Date(values.StartDate).getTime()
        let EndDateSec = new Date(values.EndDate).getTime()

        values.createdBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
        values.modifiedBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
        values.modifiedDate = dateSeconds;
        values.createdDate = dateSeconds;
        values.object = 'Account'
        values.relatedTo = {
            accountName: taskParentRecord.accountName,
            id: taskParentRecord._id
        }
        if (values.StartDate && values.EndDate) {
            values.StartDate = StartDateSec
            values.EndDate = EndDateSec
        } else if (values.StartDate) {
            values.StartDate = StartDateSec
        } else if (values.EndDate) {
            values.EndDate = EndDateSec
        }

        await RequestServer(apiMethods.post,URL_postRecords, values)
            .then((res) => {
                console.log('task form Submission  response', res);
                if(res.success){
                    setNotify({
                        isOpen: true,
                        message: res.data,
                        type: 'success'
                    })
                }else{
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: 'error'
                    })
                }
            })
            .catch((error) => {
                console.log('task form Submission  error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
            })
            .finally(()=>{
                setTimeout(() => {
                    handleModal()
                }, 2000)
            })
    }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>New Envet Log</h3>
            </div>

            <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
            >
                {(props) => {
                        const {values,dirty, isSubmitting, handleChange,handleSubmit,handleReset,setFieldValue,errors,touched,} = props;

                    return (
                        <>
                            <ToastNotification notify={notify} setNotify={setNotify} />
                            <Form className="my-form">
                                <Grid container spacing={2}>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="subject">Subject  <span className="text-danger">*</span></label>
                                        <Field name="subject" component={CustomizedSelectForFormik} className="form-customSelect">
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {
                                                TaskSubjectPicklist.map((i) => {
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                })
                                            }
                                        </Field>

                                        <div style={{ color: 'red' }}>
                                            <ErrorMessage name="subject" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                    <label htmlFor="status"> Status  </label> 
                                    <Field name="status" component={CustomizedSelectForFormik} className="form-customSelect">
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {
                                                TaskStatus.map((i) => {
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                })
                                            }
                                        </Field>
                                        </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="assignedTo"> Assigned To  </label> 
                                             <Autocomplete
                                                name="assignedTo"
                                                options={relatedUserRecNames}
                                                value={values.assignedTo}
                                                getOptionLabel={option => option.userName|| ''}
                                                isOptionEqualToValue={(option, value) =>
                                                    option.id === value
                                                }
                                                onChange={(e, value) => {
                                                    console.log('inside onchange values', value);
                                                    if(!value){                                
                                                        console.log('!value',value);
                                                        setFieldValue('assignedTo','')
                                                    }
                                                    else{
                                                        console.log('autocomplete selected value',value);                                                        
                                                        setFieldValue('assignedTo',value)
                                                    }
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    if (newInputValue.length >= 3) {
                                                        fetchUserNames(newInputValue)
                                                    }
                                                    else  if (newInputValue.length ===0) {
                                                        fetchUserNames(newInputValue)
                                                    }
                                                }}
                                        
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="assignedTo" />
                                                )}
                                                />                                         
                                    </Grid>

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="StartDate">Start Date </label> <br />
                                            <DateTimePicker
                                                name="StartDate"
                                                value={values.StartDate}
                                                onChange={(e) => {
                                                    setFieldValue('StartDate', e)
                                                }}
                                                renderInput={(params) => <TextField  {...params} style={{width:'100%'}} error={false} />}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="EndDate">End Date   </label> <br />
                                            <DateTimePicker
                                                renderInput={(params) => <TextField {...params} style={{width:'100%'}} error={false} />}
                                                value={values.EndDate}
                                                onChange={(e) => {
                                                    setFieldValue('EndDate', e)
                                                }}
                                            />

                                        </Grid>
                                    </LocalizationProvider>
                                    <Grid item xs={12} md={12}>
                                        <label htmlFor="description">Description</label>
                                        <Field as="textarea" name="description" class="form-input-textarea" style={{width:'100%'}} />
                                    </Grid>
                                </Grid>
                                <div className='action-buttons'>
                                    <DialogActions sx={{ justifyContent: "space-between" }}>
                                        <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty}>Save</Button>
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

