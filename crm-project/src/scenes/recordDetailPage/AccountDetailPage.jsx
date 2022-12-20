import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, DialogActions, Box, TextField, Autocomplete } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
import SimpleSnackbar from "../toast/test";
import "../formik/FormStyles.css"

const url = "http://localhost:4000/api/UpsertAccount";
const fetchInventoriesbyName = "http://localhost:4000/api/InventoryName";

const AccountDetailPage = ({ item }) => {

    const [singleAccount, setsingleAccount] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();
    const [inventoriesRecord, setInventoriesRecord] = useState([]);

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setsingleAccount(location.state.record.item);
        console.log('true', !location.state.record.item);
        setshowNew(!location.state.record.item)
        FetchInventoriesbyName('');

    }, [])

    const initialValues = {
        accountName: '',
        accountNumber: '',
        Inventory: '',
        inventoryName: { inventoryName: "", id: "" },
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
    }

    const savedValues = {
        accountName: singleAccount?.accountName ?? "",
        accountNumber: singleAccount?.accountNumber ?? "",
        Inventory: singleAccount?.Inventory ?? "",
        inventoryName: singleAccount?.inventoryName ?? "",
        annualRevenue: singleAccount?.annualRevenue ?? "",
        rating: singleAccount?.rating ?? "",
        type: singleAccount?.type ?? "",
        phone: singleAccount?.phone ?? "",
        industry: singleAccount?.industry ?? "",
        billingAddress: singleAccount?.billingAddress ?? "",
        billingCountry: singleAccount?.billingCountry ?? "",
        billingCity: singleAccount?.billingCity ?? "",
        billingCities: singleAccount?.billingCities ?? "",
        createdbyId: singleAccount?.createdbyId ?? "",
        createdDate: singleAccount?.createdDate ?? "",
        modifiedDate:singleAccount?.modifiedDate ?? "",
        _id: singleAccount?._id ?? "",
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
        let d = new Date();
        const formatDate =  [d.getDate(), d.getMonth()+1,d.getFullYear()].join('/')+' '+ [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
        // values.modifiedDate = formatDate; 
        if(showNew){
            values.modifiedDate = formatDate;
            values.createdDate = formatDate;
        }
        else if(!showNew){
            values.modifiedDate = formatDate;
        }
        
        console.log('after change form submission value',values);
        
        axios.post(url, values)
        .then((res) => {
            console.log('upsert record  response', res);
            setShowAlert(true)
            setAlertMessage(res.data)
            setAlertSeverity('success')

            setTimeout(() => {
                navigate(-1);
            }, 1000)
        })
        .catch((error) => {
            console.log('upsert record  error', error);
            setShowAlert(true)
            setAlertMessage(error.message)
            setAlertSeverity('error')
        })

        
    }
    const toastCloseCallback = () => {
        setShowAlert(false)
    }

    const FetchInventoriesbyName = (newInputValue) => {
        axios.post(`${fetchInventoriesbyName}?searchKey=${newInputValue}`)
            .then((res) => {
                console.log('res fetchInventoriesbyName', res.data)
                if (typeof (res.data) === "object") {
                    setInventoriesRecord(res.data)
                }
            })
            .catch((error) => {
                console.log('error fetchInventoriesbyName', error);
            })
    }

    return (

        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h3>New Account</h3> : <h3>Account Detail Page </h3>
                }
            </div>
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={showNew ? initialValues : savedValues}
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
                                {
                                    showAlert ? <SimpleSnackbar severity={alertSeverity} message={alertMessage} showAlert={showAlert} onClose={toastCloseCallback} /> : <SimpleSnackbar />
                                }

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
                                            <label htmlFor="Inventory">Inventory Name </label>
                                            <Autocomplete
                                                name="Inventory"
                                                options={inventoriesRecord}
                                                value={values.Inventory}
                                                getOptionLabel={option => option.propertyName || ''}
                                                isOptionEqualToValue={(option, value) =>
                                                    option.id === value

                                                }
                                                onChange={(e, value) => {
                                                    setFieldValue("Inventory", value.id || '')
                                                    setFieldValue("propertyName", value || '')
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    console.log('newInputValue', newInputValue);
                                                    if (newInputValue.length >= 3) {
                                                        FetchInventoriesbyName(newInputValue);
                                                    }
                                                }}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="Inventory" />
                                                )}
                                            />

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
export default AccountDetailPage;

