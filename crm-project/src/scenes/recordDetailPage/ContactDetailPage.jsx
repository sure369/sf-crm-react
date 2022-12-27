import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CurrencyInput from 'react-currency-input-field';
import { Grid, Button, Forminput, DialogActions, Autocomplete, TextField } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
import SimpleSnackbar from "../toast/SimpleSnackbar";
import "../formik/FormStyles.css"

const url = "http://localhost:4000/api/UpsertContact";
const fetchAccountsbyName = "http://localhost:4000/api/accountsname";

const ContactDetailPage = ({ item }) => {

    const [singleContact, setsingleContact] = useState();
    const [accNames, setAccNames] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setsingleContact(location.state.record.item);

        setshowNew(!location.state.record.item)
        // fetchAccountsName();     
        FetchAccountsbyName('');
    }, [])



    const initialValues = {
        Account: "",
        accountName: { accountName: "", id: "" },
        salutation: '',
        firstName: '',
        lastName: '',
        fullName:'',
        dob:'',
        phone: '',
        department: '',
        leadSource: '',
        email: '',
        fullAddress: '',
        description: '',
        createdbyId: '',
        createdDate: '',
        modifiedDate: '',
        testField1:'',
        testField2:'',
    }

    const savedValues = {
        Account: singleContact?.Account ?? "",
        accountName: singleContact?.accountName ?? "",
        // accountName:singleContact?.Accountdetails[0].accountName??"",
        salutation: singleContact?.salutation ?? "",
        firstName: singleContact?.firstName ?? "",
        lastName: singleContact?.lastName ?? "",
        fullName:singleContact?.fullName ?? "",
        phone: singleContact?.phone ?? "",
        dob:singleContact?.dop??"",
         department: singleContact?.department ?? "",
        leadSource: singleContact?.leadSource ?? "",
        email: singleContact?.email ?? "",
                fullAddress: singleContact?.fullAddress ?? "",
        description: singleContact?.description ?? "",
        createdbyId: singleContact?.createdbyId ?? "",
        createdDate: singleContact?.createdDate ?? "",
        modifiedDate: singleContact?.modifiedDate ?? "",
        _id: singleContact?._id ?? "",
    }
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
 
    const validationSchema = Yup.object({
        firstName: Yup
            .string()
            .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
            .max(15, 'lastName must be less than 15 characters'),
        lastName: Yup
            .string()
            .required('Required')
            .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
            .min(3, 'lastName must be more than 3 characters')
            .max(15, 'lastName must be less than 15 characters'),
        phone: Yup
            .string()
            .matches(phoneRegExp, 'Phone number is not valid')
            .min(10, "Phone number must be 10 characters, its short")
            .max(10, "Phone number must be 10 characters,its long"),

        email: Yup
            .string()
            .email('Invalid email address')
            .required('Required'),
    })

    const formSubmission = (values) => {

        console.log('form submission value', values);
        let d = new Date();
        const formatDate = [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/') + ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');

        if (showNew) {
            values.modifiedDate = formatDate;
            values.createdDate = formatDate;
            values.fullName = values.firstName +' '+ values.lastName;
        }
        else if (!showNew) {
            values.modifiedDate = formatDate;
            values.fullName = values.firstName +' '+ values.lastName;
        }
        console.log('after change form submission value', values);

        axios.post(url, values)
            .then((res) => {
                console.log('upsert record  response', res);
                setShowAlert(true)
                setAlertMessage(res.data)
                setAlertSeverity('success')
                setTimeout(() => {
                    navigate(-1);
                }, 2000)

            })
            .catch((error) => {
                console.log('upsert record error', error);
                setShowAlert(true)
                setAlertMessage(error.message)
                setAlertSeverity('error')
            })
    }

    const toastCloseCallback = () => {
        setShowAlert(false)
    }

    const FetchAccountsbyName = (newInputValue) => {

        axios.post(`${fetchAccountsbyName}?searchKey=${newInputValue}`)
            .then((res) => {
                console.log('res fetchAccountsbyName', res.data)
                if (typeof (res.data) === "object") {
                    setAccNames(res.data)
                }
            })
            .catch((error) => {
                console.log('error fetchAccountsbyName', error);
            })
    }
    const handleFormClose =()=>{
        navigate(-1)
    }

    return (
        <div className="App" >
            <Grid item xs={12} style={{ margin: "20px" }}>
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    {
                        showNew ? <h3>New Contact </h3> : <h3>Contact Detail Page </h3>
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
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="firstName" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="lastName" >Last Name<span className="text-danger">*</span> </label>
                                                <Field name='lastName' type="text" class="form-input" />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="lastName" />
                                                </div>
                                            </Grid>
                                            {!showNew && (
                                            <>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="fullName" >Full Name</label>
                                                    <Field name='fullName' type="text" class="form-input" disabled
                                                    />
                                                </Grid>
                                            </>
                                            )}
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="Account">Account Name </label>
                                                <Autocomplete
                                                    name="Account"
                                                    options={accNames}
                                                    value={values.Account}
                                                    // {accNames.filter((item) => {
                                                    //     return item.countryId === values.countryId;
                                                    //   })[0] || ""}

                                                    getOptionLabel={option => option.accountName || ''}

                                                    isOptionEqualToValue={(option, value) =>
                                                        option.id === value
                                                    }
                                                    onChange={(e, value) => {

                                                        setFieldValue("Account", value.id || '')
                                                        setFieldValue("accountName", value || '')

                                                    }}
                                                    // onClick={()=>{
                                                    //     console.log('inside onclick')
                                                    //     FetchAccountsbyName('');
                                                    // }}
                                                    // onBlur={()=>{  
                                                    //     console.log('inside onBlur')
                                                    //     FetchAccountsbyName('');
                                                    // }}
                                                    onInputChange={(event, newInputValue) => {
                                                        console.log('newInputValue', newInputValue);

                                                        FetchAccountsbyName(newInputValue);

                                                    }}
                                                    renderInput={params => (
                                                        <Field component={TextField} {...params} name="Account" />
                                                    )}
                                                // name="Account"
                                                // options={accNames}
                                                // getOptionLabel={option => option.accountName ||''}
                                                // isOptionEqualToValue={(option, value) =>
                                                //     option.id === value
                                                // }
                                                // onChange={(e, value) => {
                                                //     setFieldValue("accountName",value)
                                                //     setFieldValue("Account",value.id)
                                                // }}
                                                // value={values.Account}
                                                // onInputChange={(event, newInputValue) => {
                                                //     console.log('newInputValue',newInputValue);
                                                //     if(newInputValue.length>=3){
                                                //         FetchAccountsbyName(newInputValue);
                                                //     }
                                                // }}
                                                // renderInput={(params) => 
                                                //     <Field component={TextField} {...params} name="Account" />
                                                // }
                                                />

                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="phone">Phone</label>
                                                <Field name="phone" type="phone" class="form-input" />
                                                <div style={{ color: 'red' }}>
                                                <ErrorMessage name="phone" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="dop">Date of Birth</label>
                                                <Field name="dop" type="date" class="form-input" />
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
                                                <label htmlFor="fullAddress">fullAddress</label>
                                                <Field as="textarea" name="fullAddress" class="form-input" />
                                            </Grid>

                                            <Grid Grid item xs={6} md={12}>
                                                <label htmlFor="description">Description</label>
                                                <Field as="textarea" name="description" class="form-input" />
                                            </Grid>

                                            <Grid Grid item xs={6} md={12}>
                                                <label htmlFor="testFiled1">testFiled1</label>
                                                <Field as="text" name="testFiled1" class="form-input" />
                                            </Grid>
                                            <Grid Grid item xs={6} md={12}>
                                                <label htmlFor="testFiled2">testFiled2</label>
                                                <Field as="text" name="testFiled1" class="form-input" />
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
        </div>
    )

}
export default ContactDetailPage;