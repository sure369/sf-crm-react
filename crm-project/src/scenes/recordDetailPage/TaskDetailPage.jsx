import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {    Grid, Button, DialogActions,Autocomplete, TextField ,MenuItem} from "@mui/material";
import PreviewFile from "../formik/PreviewFile";
import ToastNotification from "../toast/ToastNotification";
import { TaskObjectPicklist, TaskSubjectPicklist ,TaskStatus} from "../../data/pickLists";
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { LocalizationProvider   } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CustomizedSelectDisableForFormik from "../formik/CustomizedSelectDisableForFormik";
import './Form.css'
import { TaskInitialValues, TaskSavedValues ,} from "../formik/IntialValues/formValues";
import { RequestServer } from "../api/HttpReq";
import { apiMethods } from "../api/methods";
import { apiCheckObjectPermission } from "../Auth/apiCheckObjectPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import { OBJECT_API_EVENT ,POST_EVENT,
    GET_DEAL_NAME,GET_ACCOUNT_NAME,GET_ENQUIRY_NAME,GET_USER_NAME
} from "../api/endUrls";


const TaskDetailPage = ({ item ,handleModal ,showModel }) => {
    
    const OBJECT_API = OBJECT_API_EVENT
    const URL_postRecords = POST_EVENT
    const URL_getAccountLookUpRecords=GET_ACCOUNT_NAME
    const URL_getEnquiryLookUpRecords=GET_ENQUIRY_NAME
    const URL_getDealLookUpRecords=GET_DEAL_NAME
    const URL_getUserRecords=GET_USER_NAME

    const [singleTask, setSingleTask] = useState();
    const [showNew, setshowNew] = useState()
    const [url, setUrl] = useState();
    const navigate = useNavigate();
    const fileRef = useRef();
    const location = useLocation();
    const [parentObject, setParentObject] = useState('');
    const [relatedRecNames, setRelatedRecNames] = useState([]);
    const [relatedUserRecords, setRelatedUserRecords] = useState([]);
    
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [file, setFile] = useState()
    const[showModal1,setShowModal1]=useState(showModel)
    
    const[autocompleteReadOnly,setAutoCompleteReadOnly]=useState(false)

    const [permissionValues, setPermissionValues] = useState({})
    const userRoleDpt= getLoginUserRoleDept(OBJECT_API)
    console.log(userRoleDpt,"userRoleDpt")

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setSingleTask(location.state.record.item)
        console.log('true', !location.state.record.item);
        setshowNew(!location.state.record.item)
     
        if(location.state.record.item){
            console.log('inside condition')
            callEvent(location.state.record.item.object)
            setAutoCompleteReadOnly(true)
        }  
        
        fetchObjectPermissions();        
    }, [])

    const fetchObjectPermissions=()=>{
        if(userRoleDpt){
            apiCheckObjectPermission(userRoleDpt)
            .then(res=>{
                console.log(res[0].permissions,"apiCheckObjectPermission promise res")
                setPermissionValues(res[0].permissions)
            })
            .catch(err=>{
                console.log(err,"res apiCheckObjectPermission error")
                setPermissionValues({})
            })
        }
    }

    const initialValues=TaskInitialValues
    const savedValues=TaskSavedValues(singleTask)
    console.log(savedValues,"savedValues")
    const validationSchema = Yup.object({
        subject: Yup
            .string()
            .required('Required'),
            // .notOneOf((Yup.ref('None'))),
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

            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.createdBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
            values.modifiedBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
           
            if (values.StartDate && values.EndDate) {
                values.StartDate = StartDateSec
                values.EndDate = EndDateSec
            }else if (values.StartDate) {
                values.StartDate = StartDateSec
            }else if (values.EndDate) {
                values.EndDate = EndDateSec
            }
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec
            values.createdBy = singleTask.createdBy;
            values.modifiedBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
        }
        console.log('after change form submission value', values);

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
                        // navigate(-1);
                    }, 2000)
                })
        }

       

    const callEvent = (e) => {

        console.log('inside call event',initialValues.object)

        let url1 =
            e === 'Account' ? URL_getAccountLookUpRecords :
                e === 'Enquiry' ? URL_getEnquiryLookUpRecords :
                    e === 'Deal' ? URL_getDealLookUpRecords :
                        null
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

        RequestServer(apiMethods.get,url+newInputValue )
            .then((res) => {
                console.log('res Fetch Objects byName', res.data)
               if(res.success){
                if (typeof (res.data) === "object") {
                    setRelatedRecNames(res.data)
                }else{
                    setRelatedRecNames([])
                }
               }                
            })
            .catch((error) => {
                console.log('error fetchAccountsbyName', error);
            })
    }
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

    const handleClosePage = () => {
        navigate(-1)
    }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h2>New Event Log</h2> : <h2>Task Event Log </h2>
                }
            </div>

            <Formik
                enableReinitialize={true}
                initialValues={showNew ? initialValues : savedValues}
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
                                        <Field name="subject" component={CustomizedSelectForFormik} 
                                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                        >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                         {
                                                        TaskSubjectPicklist.map((i)=>{
                                                            return <MenuItem value={i.value}>{i.text}</MenuItem>	
                                                        })
                                                    }
                                                </Field>
                                        <div style={{ color: 'red' }}>
                                            <ErrorMessage name="subject" />
                                        </div>
                                    </Grid>                           
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="object">Object  </label>
                                        <Field 
                                            name="object"
                                            component={autocompleteReadOnly ? CustomizedSelectDisableForFormik :CustomizedSelectForFormik } 
                                            testprop="testing" 
                                            disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            onChange = {(e) => {
                                                console.log('customSelect value', e.target.value)
                                                callEvent(e.target.value)
                                                setFieldValue('object', e.target.value)
                                            }}                                       
                                        >    
                                         <MenuItem value=""><em>None</em></MenuItem>                                    
                                              {
                                                TaskObjectPicklist.map((i)=>{
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                })
                                              } 
                                        </Field>
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="relatedTo"> Realated To  </label> 
                                             <Autocomplete
                                                name="relatedTo"
                                                readOnly={autocompleteReadOnly}
                                                options={relatedRecNames}
                                                value={values.relatedTo}
                                                getOptionLabel={option => option.leadName || option.accountName || option.opportunityName || ''}
                                                isOptionEqualToValue={(option, value) =>
                                                    option.id === value
                                                }
                                                onChange={(e, value) => {
                                                    console.log('inside onchange values', value);
                                                    if(!value){                                
                                                        console.log('!value',value);
                                                        setFieldValue('relatedTo',{})
                                                    }
                                                    else{
                                                        console.log('autocomplete selected value',value);                                                        
                                                        setFieldValue('relatedTo',value)
                                                    }
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    if (newInputValue.length >= 3) {
                                                        FetchObjectsbyName(newInputValue, url)
                                                    }
                                                    else  if (newInputValue.length ===0) {
                                                        FetchObjectsbyName(newInputValue, url)
                                                    }
                                                }}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="realatedTo" />
                                                )}
                                                />                                         
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
                                                options={relatedUserRecords}
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
                                    <label htmlFor="StartDate">Start Date & Time</label> <br/>
                                    <DateTimePicker 
                                     name="StartDate"
                                        value={values.StartDate}
                                        onChange={(e)=>{
                                            setFieldValue('StartDate',e)
                                        }}
                                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                         renderInput={(params) => <TextField  {...params} style={{width:'100%'}} error={false} />}
                                     />
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="EndDate">End Date & Time  </label> <br/>
                                        <DateTimePicker                                                
                                                value={values.EndDate}
                                                onChange={(e) => {                                                  
                                                    setFieldValue('EndDate',e)                                            
                                                }}
                                                renderInput={(params) => <TextField {...params} style={{width:'100%'}} error={false}/>}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                    </Grid>
                                    </LocalizationProvider>
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

