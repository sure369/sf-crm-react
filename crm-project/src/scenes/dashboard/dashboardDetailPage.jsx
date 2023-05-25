import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {    Grid, Button, DialogActions,Autocomplete, TextField ,MenuItem} from "@mui/material";
import ToastNotification from "../toast/ToastNotification";
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import CustomizedMultiSelectForFormik from '../formik/CustomizedMultiSelectForFormik';
import '../recordDetailPage/Form.css'
import { TaskInitialValues, TaskSavedValues } from "../formik/IntialValues/formValues";
import { RequestServer } from "../api/HttpReq";
import { apiMethods } from "../api/methods";
import { apiCheckObjectPermission } from "../Auth/apiCheckObjectPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import { OBJECT_API_EVENT ,POST_EVENT,
    GET_DEAL_NAME,GET_ACCOUNT_NAME,GET_ENQUIRY_NAME,GET_FIELDS_BY_OBJECT
} from "../api/endUrls";
import { DashboardInitialValues,DashboardSavedValues } from "../formik/IntialValues/formValues";
import {DashboardChartTypePicklist} from '../../data/pickLists'
import { GetTableNames } from "../global/getTableNames";


const DashboardDetailPage = ({ item ,handleModal ,showModel }) => {
    
    const OBJECT_API = OBJECT_API_EVENT
    const URL_postRecords = POST_EVENT
    const URL_getObjectFields=GET_FIELDS_BY_OBJECT
    const [singleDashboard, setSingleDashboard] = useState();
    const [showNew, setshowNew] = useState(true)
    const location = useLocation();

    const [objectNames,setObjectName]=useState([])
    const [fieldNamesByObject,setFieldNamesByObject]=useState([])

    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [permissionValues, setPermissionValues] = useState({})
    const userRoleDpt= getLoginUserRoleDept(OBJECT_API)
    console.log(userRoleDpt,"userRoleDpt")

    useEffect(() => {      
        fetchTabsName()
        // fetchObjectPermissions();        
    }, [])

    const fetchTabsName=()=>{
        GetTableNames()
        .then(res=>{
          console.log(res,"GetTableNames res in appbar")
          let arr =res.map(i=>{
            return {text:i,value:i}
          })
          setObjectName(arr)
         
        })
        .catch(err=>{
          console.log(err,"GetTableNames error in appbar")
          setObjectName([])
        })
    }
    // const fetchObjectPermissions=()=>{
    //     if(userRoleDpt){
    //         apiCheckObjectPermission(userRoleDpt)
    //         .then(res=>{
    //             console.log(res[0].permissions,"apiCheckObjectPermission promise res")
    //             setPermissionValues(res[0].permissions)
    //         })
    //         .catch(err=>{
    //             console.log(err,"res apiCheckObjectPermission error")
    //             setPermissionValues({})
    //         })
    //     }
    // }

    const initialValues=DashboardInitialValues
    const savedValues=DashboardSavedValues(singleDashboard)

    console.log(initialValues,"initialValues")
    console.log(savedValues,"savedValues")

    const validationSchema = Yup.object({
        dashboardName: Yup
            .string()
            .required('Required'),
       

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
            values.createdBy = singleDashboard.createdBy;
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

        const  handleClosePage=()=>{

        }
    
        const fetchFieldsName=(objectName)=>{
            RequestServer(apiMethods.get,URL_getObjectFields+objectName)
            .then((res)=>{
                console.log(res,"then res URL_getObjectFields")
                if(res.success){
                    let arr = res.data.fieldNames.map(i=>{
                        return {text:i,value:i}
                    })
                    console.log(arr,"URL_getObjectFields ")
                    setFieldNamesByObject(arr)
                }else{
                    console.log("error in then",res)
                    setFieldNamesByObject([])
                }
            })
            .catch((err)=>{
                console.log(err,"catch error URL_getObjectFields")
                setFieldNamesByObject([])
            })
        }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h2>New Dashboard</h2> : <h2>Existing Dashboard  </h2>
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
                                        <label htmlFor="dashboardName">Dashboard Name  <span className="text-danger">*</span></label>
                                        <Field name="dashboardName" type='text' class="form-input"
                                        // disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                        />
                                        <div style={{ color: 'red' }}>
                                            <ErrorMessage name="dashboardName" />
                                        </div>
                                    </Grid>                           
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="chartType">Chart Type  </label>
                                        <Field 
                                            name="chartType"
                                            component={CustomizedSelectForFormik} 
                                            // disabled={showNew ? !permissionValues.create : !permissionValues.edit}                                      
                                        >    
                                         <MenuItem value=""><em>None</em></MenuItem>                                    
                                              {
                                                DashboardChartTypePicklist.map((i)=>{
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                })
                                              } 
                                        </Field>
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="objectName"> Object Name  </label> 
                                        <Field 
                                            name="objectName"
                                            component={CustomizedSelectForFormik} 
                                            // disabled={showNew ? !permissionValues.create : !permissionValues.edit}                                      
                                            onChange = {(e) => {
                                                console.log('customSelect value', e.target.value)
                                                fetchFieldsName(e.target.value)
                                                setFieldValue('objectName', e.target.value)
                                            }}   
                                        >    
                                         <MenuItem value=""><em>None</em></MenuItem>                                    
                                              {
                                                objectNames.map((i)=>{
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                })
                                              } 
                                        </Field>                                    
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="fields"> Fields </label> 
                                        <Field 
                                            name="fields"
                                            component={CustomizedMultiSelectForFormik} 
                                            // disabled={showNew ? !permissionValues.create : !permissionValues.edit}                                      
                                        >    
                                         <MenuItem value=""><em>None</em></MenuItem>                                    
                                              {
                                                fieldNamesByObject &&
                                                fieldNamesByObject.map((i)=>{
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                })
                                              } 
                                        </Field>                                    
                                    </Grid>  
                                    {!showNew && (
                                        <>
                                            <Grid container spacing={2} item xs={12} md={12} direction="row">
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
export default DashboardDetailPage

