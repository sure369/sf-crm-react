import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid,Button ,DialogActions} from "@mui/material";
import { useParams,useNavigate } from "react-router-dom"
import axios from 'axios'
import SimpleSnackbar from "../toast/SimpleSnackbar";
import "../formik/FormStyles.css"

const url ="http://localhost:4000/api/UpsertInventory";

const InventoryDetailPage = ({item}) => {

    const [singleInventory,setsingleInventory]= useState(); 
    const location = useLocation();
    const navigate =useNavigate();
    const [showNew, setshowNew] = useState()
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();
  
    
    useEffect(()=>{
        console.log('passed record',location.state.record.item);
        setsingleInventory(location.state.record.item); 
        setshowNew(!location.state.record.item)      
    },[])

    
const initialValues = {
    projectName: '',
    propertyName: '',
    propertyUnitNumber: '',
    type: '',
    tower: '',
    country: '',
    city: '',
    propertyCities:[],
    floor: '',
    status: '',
    totalArea: '',
    createdbyId: '',
    createdDate: '',
    modifiedDate:'',
}

    const savedValues = {
        projectName: singleInventory?.projectName ?? "",
        propertyName:  singleInventory?.propertyName ?? "",
        propertyUnitNumber: singleInventory?.propertyUnitNumber ?? "",
        type:  singleInventory?.type ?? "",
        tower:  singleInventory?.tower ?? "",
        country:  singleInventory?.country ?? "",
        city:  singleInventory?.city ?? "",
        propertyCities:singleInventory?.propertyCities??"",
        floor:  singleInventory?.floor ?? "",
        status:  singleInventory?.status ?? "",
        totalArea: singleInventory?.totalArea ?? "",
        createdbyId: singleInventory?.createdbyId ?? "",
        createdDate:   new Date(singleInventory?.createdDate).toLocaleString(),
        modifiedDate:  new Date(singleInventory?.modifiedDate).toLocaleString(),
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

  const getCities = (country) => {
    return new Promise((resolve, reject) => {
      console.log("selected country", country);
      resolve(citiesList[country]||[]);
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

const formSubmission =(values)=>{

    console.log('form submission value',values);
   
    let dateSeconds = new Date().getTime();
    let createDateSec = new Date(values.createdDate).getTime()

    if(showNew){
        values.modifiedDate = dateSeconds;
        values.createdDate = dateSeconds;
    }
    else if(!showNew){
        values.modifiedDate = dateSeconds;
        values.createdDate = createDateSec;
    }
    
    console.log('after change form submission value',values);
    
    axios.post(url,values)
    .then((res)=>{
        console.log('upsert record  response',res);
        setShowAlert(true)
        setAlertMessage(res.data)
        setAlertSeverity('success')
        setTimeout(()=>{
            navigate(-1)
        },2000)
       
    })
    .catch((error)=> {
        console.log('upsert record  error',error);
        setShowAlert(true)
        setAlertMessage(error.message)
        setAlertSeverity('error')
    }) 
}

const toastCloseCallback = () => {
    setShowAlert(false)
}

const handleFormClose =()=>{
    navigate(-1)
}

  return (
    <Grid item xs={12} style={{margin:"20px"}}>          
            <div style={{textAlign:"center" ,marginBottom:"10px"}}>
                {
                    showNew ? <h3>New Inventory</h3> : <h3>Inventory Detail Page </h3>
                }
            </div>
           <div>
                <Formik
                    enableReinitialize={true} 
                    initialValues={showNew?initialValues:savedValues}
                    validationSchema={validationSchema}
                    onSubmit={ (values) => {formSubmission(values)}}
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
                        showAlert ? 
                            <SimpleSnackbar severity={alertSeverity} message={alertMessage} showAlert={showAlert} onClose={toastCloseCallback} /> :
                            <SimpleSnackbar message={showAlert} />
                    }

                    <Form>
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
                                    <Field name="type" as="select" class="form-input">
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
                                    <Field name="status" as="select" class="form-input">
                                        <option value="">--Select--</option>
                                        <option value="avilable ">Available </option>
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
                                    <Field name="tower" type="text" class="form-input" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                <label htmlFor="country">Country</label>
                                    <Field
                                        className="form-input"
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
                                        setFieldValue("propertyCities", _cities);
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
                                        className="form-input"
                                        value={values.city}
                                        id="city"
                                        name="city"
                                        as="select"
                                        onChange={handleChange}
                                    >
                                        <option value="None">--Select city--</option>
                                        {values.propertyCities &&
                                        values.propertyCities.map((r) => (
                                            <option key={r.value} value={r.vlue}>
                                            {r.label}
                                            </option>
                                        ))}
                                    </Field>
                                </Grid>

                                <Grid item xs={6} md={6}>
                                    <label htmlFor="floor">Floor</label>
                                    <Field name="floor" type="text" class="form-input" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="totalarea">Total Area</label>
                                    <Field name="totalarea" type="text" class="form-input" />
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