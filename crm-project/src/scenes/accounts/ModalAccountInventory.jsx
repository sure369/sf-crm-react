import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, Forminput, DialogActions, TextField, Autocomplete } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
import "../formik/FormStyles.css"
import Notification from '../toast/Notification';

const url = "http://localhost:4000/api/UpsertAccount";

const ModalInventoryAccount = ({ item }) => {

    const [inventoryParentRecord, setInventoryParentRecord] = useState();
    const location = useLocation();
    const navigate = useNavigate();
  // notification
    const[notify,setNotify]=useState({isOpen:false,message:'',type:''})
   
    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setInventoryParentRecord(location.state.record.item);      
    }, [])

    const initialValues = {
        accountName: '',
        accountNumber: '',
        InventoryId: '',
        annualRevenue: '',
        rating: '',
        type: '',
        phone: '',
        industry: '',
        billingAddress: '',
        billingCountry: '',
        billingCity: '',
        billingCities: [],
        createdbyId: '',
        createdDate:'',
        modifiedDate: '',
        inventoryDetails:'',
    }

  
    const citiesList = {
        UAE: [
            { value: "Dubai", label: "Dubai" },
            { value: "Abu Dhabi", label: "Abu Dhabi" },
            { value: "Sharjah", label: "Sharjah" },
            { value: "Ajman", label: "Ajman" },
        ],
        "Saudi Arabia": [
            { value: "Mecca", label: "Mecca" },
            { value: "Jeddah", label: "Jeddah" },
        ],
        India: [
            { value: "Chennai", label: "Chennai" },
            { value: "Bangalore", label: "Bangalore" },
            { value: "Coimabatore", label: "Coimabatore" },
        ],
    };

    const getCities = (billingCountry) => {
        return new Promise((resolve, reject) => {
            console.log("billingCountry", billingCountry);
            resolve(citiesList[billingCountry] || []);
        });
    };

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const validationSchema = Yup.object({
        accountName: Yup
            .string()
            .required('Required')
            .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
            .max(30, 'lastName must be less than 30 characters'),
        rating: Yup
            .string()
            .required('Required'),
        phone: Yup
            .string()
            .matches(phoneRegExp, 'Phone number is not valid')
            .min(10, "Phone number must be 10 characters, its short")
            .max(10, "Phone number must be 10 characters,its long"),
        annualRevenue:Yup
            .string()
            .matches(/^[0-9]+$/, "Must be only digits")
    })

    const formSubmission = (values) => {
   
        console.log('form submission value',values);


        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()

    
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.InventoryId=inventoryParentRecord._id;
            values.inventoryDetails={
                propertyName:inventoryParentRecord.propertyName,
                id:inventoryParentRecord._id
            }
       
        console.log('after change form submission value',values);
        
        axios.post(url, values)
        .then((res) => {
            console.log('upsert record  response', res);
            setNotify({
                isOpen:true,
                message:res.data,
                type:'success'
      
              })
            setTimeout(() => {
                //  navigate(-1);
            }, 2000)
        })
        .catch((error) => {
            console.log('upsert record  error', error);
            setNotify({
                isOpen:true,
                message:error.message,
                type:'error'
              })
        })

        
    }

    const handleFormClose =()=>{
        navigate(-1)
    }
    return (

        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>New Account</h3> 
            </div>
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => { formSubmission(values) }}
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
                                
                                <Notification notify={notify} setNotify={setNotify}/>

                                <Form>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="accountName">Name  <span className="text-danger">*</span></label>
                                            <Field name="accountName" type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="accountName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="accountNumber">Account Number </label>
                                            <Field name="accountNumber" type="number" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="annualRevenue">Aannual Revenue</label>
                                            <Field class="form-input" type="text" name="annualRevenue" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="annualRevenue" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="phone">Phone</label>
                                            <Field name="phone" type="phone" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="phone" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="rating"> Rating<span className="text-danger">*</span></label>
                                            <Field name="rating" as="select" class="form-input">
                                                <option value="">--Select--</option>
                                                <option value="Hot">Hot</option>
                                                <option value="Warm">Warm</option>
                                                <option value="Cold">Cold</option>
                                            </Field>
                                            <div style={{ color: 'red' }} >
                                                <ErrorMessage name="rating" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="type">Type</label>
                                            <Field name="type" as="select" class="form-input">
                                                <option value="">--Select--</option>
                                                <option value="Prospect">Prospect</option>
                                                <option value="Customer - Direct">Customer - Direct</option>
                                                <option value="Customer - Channel">Customer - Channel</option>
                                                <option value="Channel Partner / Reseller">Channel Partner / Reseller</option>
                                                <option value="Installation Partner"> Installation Partner</option>
                                                <option value="Technology Partner">Technology Partner</option>
                                                <option value="Other" >Other</option>
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="industry">Industry</label>
                                            <Field name="industry" as="select" class="form-input">
                                                <option value="">--Select--</option>
                                                <option value="Banking" >Banking</option>
                                                <option value="Construction" >Construction</option>
                                                <option value="Consulting" >Consulting</option>
                                                <option value="Education" >Education</option>
                                                <option value="Engineering" >Engineering</option>
                                                <option value="Government" >Government</option>
                                                <option value="Manufacturing" >Manufacturing</option>
                                                <option value="Hospitality" >Hospitality</option>
                                                <option value="Insurance" >Insurance</option>
                                                <option value="Technology" >Technology</option>
                                                <option value="Other" >Other</option>
                                            </Field>
                                        </Grid>



                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="billingAddress">Billing Address </label>
                                            <Field name="billingAddress" type="text" class="form-input" />
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="billingCountry">Billing Country</label>
                                            <Field
                                                className="form-input"
                                                id="billingCountry"
                                                name="billingCountry"
                                                as="select"
                                                value={values.billingCountry}
                                                onChange={async (event) => {
                                                    const value = event.target.value;
                                                    const _billingCities = await getCities(value);
                                                    console.log(_billingCities);
                                                    setFieldValue("billingCountry", value);
                                                    setFieldValue("billingCity", "");
                                                    setFieldValue("billingCities", _billingCities);
                                                }}
                                            >
                                                <option value="None">--Select--</option>
                                                <option value="UAE">UAE</option>
                                                <option value="Saudi Arabia">Saudi Arabia</option>
                                                <option value="India">India</option>
                                            </Field>
                                        </Grid>
                                        
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="billingCity">Billing City</label>
                                            <Field
                                                className="form-input"
                                                value={values.billingCity}
                                                id="billingCity"
                                                name="billingCity"
                                                as="select"
                                                onChange={handleChange}
                                            >
                                                <option value="None">--Select billingCity--</option>
                                                {values.billingCities &&
                                                    values.billingCities.map((r) => (
                                                        <option key={r.value} value={r.vlue}>
                                                            {r.label}
                                                        </option>
                                                    ))}
                                            </Field>
                                        </Grid>

                                        
                                    </Grid>

                                    <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>

                                            <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>

                                            <Button type="reset" variant="contained" onClick={handleFormClose}  >Cancel</Button>
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

export default ModalInventoryAccount;
