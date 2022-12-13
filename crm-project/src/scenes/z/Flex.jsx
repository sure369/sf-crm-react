import React,{useEffect,useState} from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Inventories from '../inventories';
import Test from './Test';
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid,Button ,DialogActions} from "@mui/material";
import SimpleSnackbar from "../toast/test";
import "../formik/FormStyles.css"

const urlInventory = "http://localhost:4000/api/inventories";
const url ="http://localhost:4000/api/UpsertInventory";

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        p: 1,
        m: 1,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
        color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}

Item.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

const FlexShrink = () => {
  
    const [property, setProperty] = useState([{}])
    const [rowId,setRowId] = useState()
    const [singleProps,setSingleProps] =useState({})
    const [loading,setLoading] = useState(true)
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [showNew, setshowNew] = useState()
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();

    useEffect(()=>{

       axios.post(urlInventory)
        .then((res)=>{
          console.log('inside get records', res)
          setProperty(res.data)
          console.log('records ', res.data);
          setSingleProps(res.data[0] || ''); 
          setLoading(false)       
        }) 
    },[])

    const InventoryDetailPage = ({item}) => {
    const savedValues = {
        projectName: singleProps?.projectName ?? "",
        propertyName:  singleProps?.propertyName ?? "",
        propertyUnitNumber: singleProps?.propertyUnitNumber ?? "",
        type:  singleProps?.type ?? "",
        tower:  singleProps?.tower ?? "",
        country:  singleProps?.country ?? "",
        city:  singleProps?.city ?? "",
        floor:  singleProps?.floor ?? "",
        status:  singleProps?.status ?? "",
        totalArea: singleProps?.totalArea ?? "",
        createdbyId: singleProps?.createdbyId ?? "",
        createdDate: singleProps?.createdDate ?? "",
        _id:   singleProps?._id ?? "",
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

const formSubmission =(values)=>{
      
    axios.post(url,values)
    .then((res)=>{
        console.log('upsert record  response',res);
        setShowAlert(true)
        setAlertMessage(res.data)
        setAlertSeverity('success')
        
       
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
                    initialValues={savedValues}
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
                                        className="form-input"
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
                                    <Field name="floor" type="text" class="form-input" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="totalarea">Total Area</label>
                                    <Field name="totalarea" type="text" class="form-input" />
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
  return (
    <div style={{ width: '100%' }}>
      <Box
        sx={{ display: 'flex', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}
      >
    
      <Item sx={{ width: '50%' }}><InventoryDetailPage /></Item>
        <Item sx={{ width: '50%' }}> <Inventories/> </Item>
      </Box>
    </div>
  );
}
export default  FlexShrink

// import React,{useEffect} from 'react';
// import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
// import Inventories from '../inventories';
// import Test from './Test';

// function Item(props) {
//   const { sx, ...other } = props;
//   return (
//     <Box
//       sx={{
//         p: 1,
//         m: 1,
//         bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
//         color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
//         border: '1px solid',
//         borderColor: (theme) =>
//           theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
//         borderRadius: 2,
//         fontSize: '0.875rem',
//         fontWeight: '700',
//         ...sx,
//       }}
//       {...other}
//     />
//   );
// }

// Item.propTypes = {
//   /**
//    * The system prop that allows defining system overrides as well as additional CSS styles.
//    */
//   sx: PropTypes.oneOfType([
//     PropTypes.arrayOf(
//       PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
//     ),
//     PropTypes.func,
//     PropTypes.object,
//   ]),
// };

// const FlexShrink = () => {
  

//   return (
//     <div style={{ width: '100%' }}>
//       <Box
//         sx={{ display: 'flex', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}
//       >
//       {/* <AccountDetailPage item={undefined} /> */}
//       {/* <AccountForm/> */}
//       <Item sx={{ width: '50%' }}><Test /></Item>
//         <Item sx={{ width: '50%' }}> <Inventories/> </Item>
//       </Box>
//     </div>
//   );
// }
// export default  FlexShrink