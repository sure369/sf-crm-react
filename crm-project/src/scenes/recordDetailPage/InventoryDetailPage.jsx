import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, DialogActions, MenuItem } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import ToastNotification from '../toast/ToastNotification';
import { InvCitiesPickList, InvCountryPickList, InvStatusPicklist, InvTypePicklist } from '../../data/pickLists';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import './Form.css'
import { RequestServer } from '../api/HttpReq';
import { InventoryInitialValues,InventorySavedValues } from '../formik/IntialValues/formValues';

const url = `${process.env.REACT_APP_SERVER_URL}/UpsertInventory`;

const InventoryDetailPage = ({ item }) => {

    const [singleInventory, setsingleInventory] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    // notification
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })


    useEffect(() => {

        console.log(JSON.parse(sessionStorage.getItem('loggedInUser')), "loggedInUser")

        console.log('passed record', location.state.record.item);
        setsingleInventory(location.state.record.item);
        setshowNew(!location.state.record.item)
    }, [])

    const initialValues=InventoryInitialValues;
    const savedValues =InventorySavedValues(singleInventory)

    const getCities = (country) => {
        return new Promise((resolve, reject) => {
            console.log("selected country", country);
            resolve(InvCitiesPickList[country] || []);
        });
    };

    const validationSchema = Yup.object({
        projectName: Yup
            .string()
            .required('Required'),
        propertyName: Yup
            .string()
            .required('Required'),
        type: Yup
            .string()
            .required('Required'),
        status: Yup
            .string()
            .required('Required'),
    })

    const formSubmission = (values) => {

        console.log('form submission value', values);


        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()

        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.createdBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
            values.modifiedBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec;
            values.createdBy = singleInventory.createdBy;
            values.modifiedBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
        }

        console.log('after change form submission value', values);

        RequestServer(url, values)
            .then((res) => {                
            console.log(res,"res from RequestServer")
                if (res.success) {
                    setNotify({
                        isOpen: true,
                        message: res.data,
                        type: "success",
                    });               
                } else {
                    console.log(res, "error in then");
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: "error",
                    });
                }
            })
            .catch((error)=>{
                setNotify({
                            isOpen:true,
                            message:error.message,
                            type:'error'
                          })
            })
            .finally(()=>{
                setTimeout(() => {
                    navigate(-1);
                }, 2000);
            })   
    }

    const handleFormClose = () => {
        navigate(-1)
    }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h2>New Inventory</h2> : <h2>Inventory Detail Page </h2>
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
                        const {values,dirty, isSubmitting, handleChange,handleSubmit,handleReset,setFieldValue,errors,touched,} = props;

                        return (
                            <>
                                <ToastNotification notify={notify} setNotify={setNotify} />
                                <Form className='my-form'>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="projectName">Project Name <span className="text-danger">*</span> </label>
                                            <Field name="projectName" type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="projectName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="propertyName">Property Name <span className="text-danger">*</span> </label>
                                            <Field name="propertyName" type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="propertyName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="propertyUnitNumber">Property Unit Number</label>
                                            <Field name="propertyUnitNumber" type="text" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="type">Type <span className="text-danger">*</span> </label>
                                            <Field name="type" component={CustomizedSelectForFormik}>
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    InvTypePicklist.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="type" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="status">Status <span className="text-danger">*</span> </label>
                                            <Field name="status" component={CustomizedSelectForFormik}>
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    InvStatusPicklist.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="status" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="tower">Tower </label>
                                            <Field name="tower" type="text" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="country">Country</label>
                                            <Field
                                                className="form-input"
                                                id="country"
                                                name="country"
                                                component={CustomizedSelectForFormik}
                                                value={values.country}
                                                onChange={async (event) => {
                                                    const value = event.target.value;
                                                    const _cities = await getCities(value);
                                                    console.log(_cities);
                                                    setFieldValue("country", value);
                                                    setFieldValue("city", "");
                                                    setFieldValue("propertyCities", _cities);
                                                }}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    InvCountryPickList.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="city">City</label>
                                            <Field
                                                className="form-input"
                                                value={values.city}
                                                id="city"
                                                name="city"
                                                component={CustomizedSelectForFormik}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {values.propertyCities &&
                                                    values.propertyCities.map((r) => (

                                                        <MenuItem key={r.value} value={r.value}>{r.text}</MenuItem>
                                                    )

                                                    )}
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="floor">Floor</label>
                                            <Field name="floor" type="text" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="totalArea">Total Area</label>
                                            <Field name="totalArea" type="text" class="form-input" />
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
                                                    <Field name='createdDate' type="text" class="form-input" 
                                                    value={values.createdBy +',  '+values.createdDate} disabled />
                                                </Grid>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="modifiedDate" >Modified By</label>
                                                    <Field name='modifiedDate' type="text" class="form-input" 
                                                    value={values.modifiedBy +',  '+values.modifiedDate} disabled />
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
                                            <Button type="reset" variant="contained" onClick={handleFormClose}   >Cancel</Button>
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
export default InventoryDetailPage;