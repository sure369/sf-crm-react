import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid,Button ,Forminput,DialogActions} from "@mui/material";
import { useParams,useNavigate } from "react-router-dom"
import axios from 'axios'
import SimpleSnackbar from "../toast/test";
import "../formik/FormStyles.css"

const url ="http://localhost:4000/api/UpsertLead";

const LeadDetailPage = ({item}) => {

    const [singleLead,setsingleLead]= useState(); 
    const location = useLocation();
    const navigate =useNavigate();
    const [showNew, setshowNew] = useState()
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();

    useEffect(()=>{
        console.log('passed record',location.state.record.item);
        setsingleLead(location.state.record.item); 
        console.log('true', !location.state.record.item);
        setshowNew(!location.state.record.item)
    },[])      

    const initialValues = {
        salutation: '',
        firstName: '',
        lastName: '',
        company: '',
        phone: '',
        leadSource: '',
        industry: '',
        leadStatus: '',
        email: '',
        description: '',
        createdbyId: '',
        createdDate: '',
    }

    
    const savedValues = {
        salutation:singleLead?.salutation ?? "",
        firstName:singleLead?.firstName ?? "",
        lastName:  singleLead?.lastName ?? "",
        company: singleLead?.company ?? "",
        phone:  singleLead?.phone ?? "",
        leadSource:  singleLead?.leadSource ?? "",
        industry:  singleLead?.industry ?? "",
        leadStatus:  singleLead?.leadStatus ?? "",
        email:  singleLead?.email ?? "",
        description:  singleLead?.description ?? "",
        createdbyId:  singleLead?.createdbyId ?? "",
        createdDate: singleLead?.createdDate ?? "",
        _id:   singleLead?._id ?? "",
    }



    const validationSchema = Yup.object({
        lastName: Yup
            .string()
            .required('Required'),
        company: Yup
            .string()
            .required('Required'),
        leadStatus: Yup
            .string()
            .required('Required'),
        email:Yup
            .string()
            .email('Invalid email address')
            .required('Required'),
    })

    const toastCloseCallback = () => {
        setShowAlert(false)
    }

  return (
    <Grid item xs={12} style={{margin:"20px"}}>          
    <div style={{textAlign:"center" ,marginBottom:"10px"}}>
        {
            showNew ? <h3>New Lead</h3> : <h3>Lead Detail Page </h3>
        }
    </div>
   <div>
                <Formik
                    enableReinitialize={true} 
                    initialValues={showNew?initialValues:savedValues}
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
                            setTimeout(() => {
                                navigate(-1)
                            }, 2000);
                            
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

                                    <label htmlFor="company">Company<span className="text-danger">*</span></label>
                                    <Field name="company" type="text" class="form-input" />
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="company" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="phone">Phone</label>
                                    <Field name="phone" type="phone" class="form-input" />
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
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="industry">Industry</label>
                                    <Field name="industry" as="select" class="form-input">
                                        <option value="">--Select--</option>
                                        <option value="Agriculture" >Agriculture</option>
                                        <option value="Banking" >Banking</option>
                                        <option value="Communications" >Communications</option>
                                        <option value="Construction" >Construction</option>
                                        <option value="Consulting" >Consulting</option>
                                        <option value="Education" >Education</option>
                                        <option value="Engineering" >Engineering</option>
                                        <option value="Government" >Government</option>
                                        <option value="Manufacturing" >Manufacturing</option>
                                        <option value="Hospitality" >Hospitality</option>
                                        <option value="Insurance" >Insurance</option>
                                        <option value="Technology" >Technology</option>
                                        <option value="Transportation" >Transportation</option>
                                        <option value="Other" >Other</option>
                                    </Field>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="leadStatus"> Lead Status <span className="text-danger">*</span> </label>
                                    <Field name="leadStatus" as="select" class="form-input">
                                        <option value="">--Select--</option>
                                        <option value="open-not contacted">Open-Not Contacted</option>
                                        <option value="working-contacted">Working-Contacted</option>
                                        <option value="closed-converted">Closed-Converted</option>
                                        <option value="closed-not converted">closed-Not Converted</option>
                                    </Field>
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="leadStatus" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="fax">Fax</label>
                                    <Field name="fax" type="text" class="form-input" />
                                </Grid>
                                <Grid item xs={12} md={12}>
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
export default LeadDetailPage;