import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CurrencyInput from 'react-currency-input-field';
import { Grid,Button ,FormControl} from "@mui/material";
import { useParams,useNavigate } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'


const url ="http://localhost:4000/api/editInventory";

const InventoryDetailPage = ({item}) => {

    const [singleInventory,setsingleInventory]= useState(); 
    const location = useLocation();
    const navigate =useNavigate();
    useEffect(()=>{
        console.log('passed record',location.state.record.item);
        setsingleInventory(location.state.record.item);       
    })

    const initialValues = {
        projectName: singleInventory?.projectName ?? "",
        propertyName:  singleInventory?.propertyName ?? "",
        propertyUnitNumber: singleInventory?.propertyUnitNumber ?? "",
        type:  singleInventory?.type ?? "",
        tower:  singleInventory?.tower ?? "",
        country:  singleInventory?.country ?? "",
        city:  singleInventory?.city ?? "",
        floor:  singleInventory?.floor ?? "",
        status:  singleInventory?.status ?? "",
        totalArea: singleInventory?.totalArea ?? "",
        _id:   singleInventory?._id ?? "",
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

  const getCities = (totalArea) => {
    return new Promise((resolve, reject) => {
      console.log("totalArea", totalArea);
      resolve(citiesList[totalArea]||[]);
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

  return (
        <div className="container mb-10">
            <div className="col-lg-12 text-center mb-3">
                <h3>Inventory Detail page</h3>
            </div>

            <div class="container overflow-hidden ">

                <Formik
                    enableReinitialize={true} 
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        await new Promise((resolve) => setTimeout(resolve, 500));
                        console.log("updated record values", values);  
                        
                        axios.post(url,values)
                        .then((res)=>{
                            console.log('updated record  response',res);
                        })
                        .catch((error)=> {
                            console.log('updated record  error',error);
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
                <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                 <Grid item xs={6} md={6}>
                                    <label htmlFor="projectName">Project Name <span className="text-danger">*</span> </label>
                                    <Field name="projectName" type="text" class="form-control" /> 
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="projectName" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="propertyName">Property Name <span className="text-danger">*</span> </label>
                                    <Field name="propertyName" type="text" class="form-control" />
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="propertyName" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="propertyUnitNumber">Property Unit Number</label>
                                    <Field name="propertyUnitNumber" type="text" class="form-control" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="type">Type <span className="text-danger">*</span> </label>
                                    <Field name="type" as="select" class="form-select">
                                        <option value="">--Select--</option>
                                        <option value="apartment ">Apartment </option>
                                        <option value="Commercial Space"> Commercial Space</option>
                                        <option value="Townhouse">Townhouse</option>
                                        <option value="Duplex">Duplex</option>
                                        <option value="Villa">Villa</option>
                                    </Field>
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="type" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="status">Status <span className="text-danger">*</span> </label>
                                    <Field name="status" as="select" class="form-select">
                                        <option value="">--Select--</option>
                                        <option value="avilable ">Avilable </option>
                                        <option value="sold"> Sold</option>
                                        <option value="booked">Booked</option>
                                        <option value="processed">Processed</option>
                                    </Field>
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="status" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="tower">Tower </label>
                                    <Field name="tower" type="text" class="form-control" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                <label htmlFor="country">Country</label>
                                    <Field
                                        className="form-control"
                                        id="country"
                                        name="country"
                                        as="select"
                                        value={values.country}
                                        onChange={async (event) => {
                                        const value = event.target.value;
                                        const _cities = await getCities(value);
                                        console.log(_cities);
                                        setFieldValue("country", value);
                                        setFieldValue("city", "");
                                        setFieldValue("billingCities", _cities);
                                        }}
                                    >
                                        <option value="None">--Select--</option>
                                        <option value="UAE">UAE</option>
                                        <option value="Saudi Arabia">Saudi Arabia</option>
                                        <option value="India">India</option>
                                    </Field>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                <label htmlFor="city">City</label>
                                    <Field
                                        className="form-control"
                                        value={values.city}
                                        id="city"
                                        name="city"
                                        as="select"
                                        onChange={handleChange}
                                    >
                                        <option value="None">--Select city--</option>
                                        {values.billingCities &&
                                        values.billingCities.map((r) => (
                                            <option key={r.value} value={r.vlue}>
                                            {r.label}
                                            </option>
                                        ))}
                                    </Field>
                                </Grid>

                                <Grid item xs={6} md={6}>
                                    <label htmlFor="floor">Floor</label>
                                    <Field name="floor" type="text" class="form-control" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="totalarea">Total Area</label>
                                    <Field name="totalarea" type="text" class="form-control" />
                                </Grid>
                               
                                <Grid item xs={12} md={12}>
                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Submit</Button>
                                    <Button type="reset" variant="contained" onClick={handleReset}  disabled={!dirty || isSubmitting} >Clear</Button>
                                </Grid>
                            </Grid>
                            </form>
            )
             }}
                </Formik>
            </div>
        </div>   
  )

}
export default InventoryDetailPage;