import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CurrencyInput from 'react-currency-input-field';
import { Grid,Button ,Forminput,DialogActions,Autocomplete,TextField} from "@mui/material";
import { useParams,useNavigate } from "react-router-dom"
import axios from 'axios'
import SimpleSnackbar from "../toast/test";
import "../formik/FormStyles.css"

const url ="http://localhost:4000/api/UpsertContact";
const fetchAccountsbyNameUrl = "http://localhost:4000/api/accountsname";
const fetchAccountsUrl = "http://localhost:4000/api/accountsRecentName";

const ContactDetailPage = ({item}) => {

    const [singleContact,setsingleContact]= useState(); 
    const[accNames,setAccNames]= useState([]);
    const location = useLocation();
    const navigate =useNavigate();
    const [showNew, setshowNew] = useState()
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();

    useEffect(()=>{
        console.log('passed record',location.state.record.item);
        setsingleContact(location.state.record.item); 
       
        setshowNew(!location.state.record.item) 
        fetchAccountsName();      
    },[])

    


    const fetchAccountsName = () => {
        axios.post(fetchAccountsUrl)
            .then((res) => {
                console.log('res fetchAccountsUrl', res.data)

                setAccNames(res.data)

            })
            .catch((error) => {
                console.log('error fetchAccountsUrl', error);
            })
    }
    const initialValues = {
        Account:"",
        // accountName: {accountName:"",id:""},
        salutation:  '',
        firstName: '',
        lastName:  '',
        dop: '',
        phone:  '',
        department:'',  
        leadSource:  '',
        email:  '',
        file:'',
        mailingAddress: '', 
        description:  '',
        createdbyId:  '',
        createdDate: '',
       
    }

    const savedValues = {
        Account:singleContact?.accountName??"",
        // accountName:singleContact?.accountName??"",
        salutation:  singleContact?.salutation ?? "",
        firstName:  singleContact?.firstName ?? "",
        lastName:  singleContact?.lastName ?? "",
        dop: singleContact?.dop ?? "",
        phone:  singleContact?.phone ?? "",
        department:  singleContact?.department ?? "",
        leadSource:  singleContact?.leadSource ?? "",
        email:  singleContact?.email ?? "",
        file:singleContact?.file ?? "",
        mailingAddress:  singleContact?.mailingAddress ?? "",
        description:  singleContact?.description ?? "",
        createdbyId:  singleContact?.createdbyId ?? "",
        createdDate: singleContact?.createdDate ?? "",
        _id:   singleContact?._id ?? "", 
    }

    const validationSchema = Yup.object({
        lastName: Yup
            .string()
            .required('Required'),
        email: Yup
            .string()
            .email('Invalid email address')
            .required('Required'),
    })
    
    const toastCloseCallback = () => {
        setShowAlert(false)
    }
    const fetchAcc =(e)=>{
     
     return (e.length>=3 ?  FetchAccountsbyName(e) :'type 3 characters')

    }

    const FetchAccountsbyName = (e) => {
        
        axios.post(`${fetchAccountsbyNameUrl}?searchKey=${e}`)
            .then((res) => {
                console.log('res fetchAccountsbyNameUrl', res.data)
                setAccNames(res.data)
            })
            .catch((error) => {
                console.log('error fetchAccountsbyNameUrl', error);
            })
    }

    const blur =() =>{
        console.log('inside blur')
        axios.post(fetchAccountsUrl)
        .then((res) => {
            console.log('res fetchAccountsUrl', res.data)
            setAccNames(res.data)
        })
        .catch((error) => {
            console.log('error fetchAccountsUrl', error);
        })
    }

    return (
        <Grid item xs={12} style={{margin:"20px"}}>          
            <div style={{textAlign:"center" ,marginBottom:"10px"}}>
                {
                    showNew ? <h3>New Contact </h3> : <h3>Contact Detail Page </h3>
                }
            </div>
            <div>
                <Formik
                    enableReinitialize={true} 
                    initialValues={showNew?initialValues:savedValues }
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        await new Promise((resolve) => setTimeout(resolve, 500));
                        console.log("upsert record values", values);  
                        
                        axios.post(url,values)
                        .then((res)=>{
                            console.log('upsert record  response',res);
                            setShowAlert(true)
                            setAlertMessage(res.data)
                            setAlertSeverity('success')
                            setTimeout(()=>{
                                navigate(-1);
                            },2000)
                           
                        })
                        .catch((error)=> {
                            console.log('upsert record error',error);
                            setShowAlert(true)
                            setAlertMessage(error.message)
                            setAlertSeverity('error') 
                        })                   
                      }}
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
                        showAlert ? <SimpleSnackbar severity={alertSeverity} message={alertMessage} showAlert={showAlert} onClose={toastCloseCallback} /> : <SimpleSnackbar message={showAlert} />
                    }
                <Form>
                    <Grid container spacing={2}>
                                    <Grid item xs={6} md={2}>
                                    <label htmlFor="salutation">Salutation  </label>
                                    <Field name="salutation" as="select" class="form-input">
                                        <option value="">--Select--</option>
                                        <option value="Mr.">Mr.</option>
                                        <option value="Ms.">Ms.</option>
                                        <option value="Mrs.">Mrs.</option>
                                        <option value="Dr.">Dr.</option>
                                        <option value="Prof.">Prof.</option>
                                    </Field>
                                    </Grid>
                                    <Grid item xs={6} md={4}>

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
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="accountName">Account Name </label>
                                    {/* <Field name="accountName" class="form-input"
                                     onchange={FetchAccountsbyName(values.accountName)} 
                                     onClick={blur}
                                    
                                     /> */}

                                      <Autocomplete
                                        name="accountName"
                                        options={accNames}
                                        getOptionLabel={option => option.accountName ||''}
                                        // disableCloseOnSelect
                                        isOptionEqualToValue={(option, value) =>
                                             option.accountName === value.accountName
                                         }
                                        onChange={(e, value) => {
                                           
                                          
                                            // setFieldValue("accountName", value)
                                             setFieldValue("Account",value.id)
                                        }}
                                        value={values.id}
                                        onInputChange={(event, newInputValue) => {
                                            console.log('newInputValue',newInputValue);
                                            axios.post(`${fetchAccountsbyNameUrl}?searchKey=${newInputValue}`)
                                            .then((res) => {
                                                console.log('res fetchAccountsbyNameUrl', res.data)
                                                if(typeof(res.data)=== "object"){
                                                    setAccNames(res.data)
                                                }
                                            })
                                            .catch((error) => {
                                                console.log('error fetchAccountsbyNameUrl', error);
                                            })
                                          }}
                                        renderInput={params => (
                                        <Field component={TextField} {...params} name="accountName" />
                                        )}
                                    />  

                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="phone">Phone</label>
                                    <Field name="phone" type="phone" class="form-input" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="department">Department</label>
                                    <Field name="department" type="text" class="form-input" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="email">Email <span className="text-danger">*</span></label>
                                    <Field name="email" type="text" class="form-input" />
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="email" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="leadSource"> lead Source</label>
                                    <Field name="leadSource" as="select" class="form-input">
                                        <option value="">--Select--</option>
                                        <option value="web">Web</option>
                                        <option value="phone Inquiry">phone Inquiry</option>
                                        <option value="Partner Referral">Partner Referral</option>
                                        <option value="Purchased List">Purchased List</option>
                                        <option value="other">Other</option>
                                    </Field>
                                </Grid>
                                <Grid Grid item xs={6} md={6}>
                                    <label htmlFor="files">File</label>          
                                    <input id="file" name="file" type="file" multiple onChange={(event) => {
                                    setFieldValue("file", event.currentTarget.files);
                                    }} className="form-input" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="date">date</label>
                                    <Field name="date" type="date" class="form-input" />
                                </Grid>
                                <Grid Grid item xs={6} md={12}>
                                    <label htmlFor="description">Description</label>
                                    <Field as="textarea" name="description" class="form-input" />
                                </Grid>
                                </Grid>
                                <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>

                                       
                                           {
                                                showNew ?
                                                <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>
                                                    :
                                                    
                                                        <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Update</Button>
                                           }                                      
                                        <Button type="reset" variant="contained" onClick={handleReset} disabled={!dirty || isSubmitting}  >Cancel</Button>
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
export default ContactDetailPage;