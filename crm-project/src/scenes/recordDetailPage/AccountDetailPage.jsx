import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
import SimpleSnackbar from "../toast/test";
import "../formik/FormStyles.css"

const url = "http://localhost:4000/api/UpsertAccount";

const AccountDetailPage = ({ item }) => {

    const [singleAccount, setsingleAccount] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setsingleAccount(location.state.record.item);
        console.log('true', !location.state.record.item);
        setshowNew(!location.state.record.item)
    },[])

    const savedValues = {
        accountName: singleAccount?.accountName ?? "",
        accountNumber: singleAccount?.accountNumber ?? "",
        annualRevenue: singleAccount?.annualRevenue ?? "",
        rating: singleAccount?.rating ?? "",
        type: singleAccount?.type ?? "",
        phone: singleAccount?.phone ?? "",
        industry: singleAccount?.industry ?? "",
        billingAddress: singleAccount?.billingAddress ?? "",
        billingCountry: singleAccount?.billingCountry ?? "",
        billingCity: singleAccount?.billingCity ?? "",
        billingCities: [],
        shippingAddress: singleAccount?.shippingAddress ?? "",
        website: singleAccount?.website ?? "",
        description: singleAccount?.description ?? "",
        createdbyId: singleAccount?.createdbyId ?? "",
        createdDate: singleAccount?.createdDate ?? "",
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


    const validationSchema = Yup.object({
        accountName: Yup
            .string()
            .required('Required'),
        rating: Yup
            .string()
            .required('Required'),
    })

    const toastCloseCallback = () => {
        setShowAlert(false)
    }

    return (
        <div className="container mb-10">
            <div className="col-lg-12 text-center mb-3">
                {
                    showNew ? <h3>New Account</h3> : <h3>Account Detail Page </h3>
                }
            </div>
            <div class="container overflow-hidden ">
                <Formik
                    enableReinitialize={true}
                    initialValues={savedValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        await new Promise((resolve) => setTimeout(resolve, 500));
                        console.log("upsert record values", values);

                        axios.post(url, values)
                            .then((res) => {
                                console.log('upsert record  response', res);
                                setShowAlert(true)
                                setAlertMessage(res.data)
                                setAlertSeverity('success')
                                navigate(-1);
                            })
                            .catch((error) => {
                                console.log('upsert record  error', error);
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
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="accountName">Name  <span className="text-danger">*</span></label>
                                            <Field name="accountName" type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="accountName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="accountNumber">Account Number </label>
                                            <Field name="accountNumber" type="text" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="annualRevenue">Aannual Revenue</label>
                                            <Field class="form-input" type="nu,ber" name="annualRevenue" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="phone">Phone</label>
                                            <Field name="phone" type="phone" class="form-input" />
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
                                            <label htmlFor="noofEmployees">Number of Employees</label>
                                            <Field name="noofEmployees" type="text" class="form-input" />
                                        </Grid>


                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="billingAddress">Billing Address </label>
                                            <Field name="billingAddress" type="text" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="shippingAddress">Shipping Address </label>
                                            <Field name="shippingAddress" type="text" class="form-input" />
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
                                        <Grid item xs={12} md={12}>
                                            <label htmlFor="description">Description</label>
                                            <Field as="textarea" name="description" class="form-input" />
                                        </Grid>
                                        <div>
                                           {
                                                showNew ?
                                                    <Grid item xs={12} md={12}>
                                                        <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>
                                                        <Button type="reset" variant="contained" onClick={handleReset} disabled={!dirty || isSubmitting} >Cancel</Button>
                                                    </Grid>
                                                    :
                                                    <Grid item xs={12} md={12}>
                                                        <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Update</Button>
                                                        <Button type="reset" variant="contained" onClick={handleReset} disabled={!dirty || isSubmitting} >Cancel</Button>
                                                    </Grid>
                                            } 
                                        </div>
                                    </Grid>
                                </Form>
                            </>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )

}
export default AccountDetailPage;

