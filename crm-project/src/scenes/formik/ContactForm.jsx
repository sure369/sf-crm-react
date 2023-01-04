

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, FormControl, Input, TextField } from "@mui/material";
import axios from 'axios'
import { Autocomplete } from "@mui/material";
//import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import Thumb from "./Thumb";
import SimpleSnackbar from "../toast/SimpleSnackbar";
import "./FormStyles.css"

const url = "http://localhost:4000/api/contactInsert";
const fetchAccountsUrl = "http://localhost:4000/api/accountsname";

const initialValues = {
    accountName: '',
    salutation: '',
    firstName: '',
    lastName: '',
    dop: '',
    phone: '',
    department: '',
    leadSource: '',
    email: '',
    mailingAddress: '',
    description: '',
    file: '',
    date: '',
    createdbyId: '',
    createdDate: '',
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

const onSubmit = (values, { resetForm }) => {
    console.log(values);
    resetForm({ values: '' })
}

const ContactForm = () => {

    const navigate = useNavigate();
    const fileRef = useRef();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();
    const [alertNotes, setAlertNotes] = useState({
        isShow: false,
        message: '',
        severity: ''
    })

    const [name, setName] = useState([])
    useEffect(() => {
        fetchAccountsName();
    }, [])

    const fetchAccountsName = () => {
        axios.post(fetchAccountsUrl)
            .then((res) => {
                console.log('res fetchAccountsUrl', res.data)

                setName(res.data)

            })
            .catch((error) => {
                console.log('error fetchAccountsUrl', error);
            })
    }

    const toastCloseCallback = () => {
        setShowAlert(false)
    }
    const formsubmission=(values)=>{
                        // axios.post(url, values)
                        //     .then((res) => {
                        //         console.log('post response', res);
                        //         console.log('post ', 'data send');

                        //         setShowAlert(true)
                        //         setAlertMessage(res.data)
                        //         setAlertSeverity('success')

                        //         setTimeout(() => {
                        //             navigate(-1);
                        //         }, 2000);

                        //         resetForm({ values: '' })
                        //     })
                        //     .catch((error) => {
                        //         console.log('error', error);
                        //         setShowAlert(true)
                        //         setAlertMessage(error.message)
                        //         setAlertSeverity('error')

                        //     })
    }
    return (
        <div className="container mb-10">
            <div className="col-lg-12 text-center mb-3">
                <h3>New Contact</h3>
            </div>
            <div class="container overflow-hidden ">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        console.log('values',values);
                        formsubmission(values);
                       
                    }}
                >
                 {({ values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,setFieldValue}) => (
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
                                        <Field component={TextField} name="firstName" label="first  Name" variant="outlined" fullWidth  />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="lastName" >Last Name<span className="text-danger">*</span> </label>
                                            <Field name='lastName' type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="lastName" />
                                            </div>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                        <Autocomplete
                                            id="accountName"
                                            options={name}
                                            getOptionLabel={option => option.accountName}
                                            value={values.accountName}
                                           
                                            onChange={(e, value) => {
                                                    console.log('onchange',value);
                                                    console.log('e',e)
                                          
                                            setFieldValue("accountName", value);
                                            }}
                                            renderInput={params => (
                                                <>
                                                  <label htmlFor="accountName" >Account Name </label>
                                                    <Field
                                                        component={TextField}
                                                        {...params}
                                                        name="accountName"
                                                    />
                                                </>
                                               
                                            )}
                                        />
                                        </Grid>

                                        {/* <Grid item xs={6} md={6}>
                                        <label htmlFor="accountName" >accountName</label>
                                            <Autocomplete
                                                disablePortal
                                                id="accountName"
                                                name="accountName"
                                                options={name}
                                                onChange={(e, value) => {
                                                    console.log('value', value);
                                                    setFieldValue("account", value)
                                                }
                                                }
                                                // getOptionLabel={(option)=>(option.accountName?option.accountName:'')}
                                                getOptionLabel={(option) => option.accountName || ""}
                                                renderInput={(params) =>

                                                    <Field
                                                    class="form-input"
                                                        // component={TextField}
                                                        {...params}
                                                        // onChange={ handleChange }
                                                        margin="normal"
                                                        label="accountName"
                                                        name="accountName"
                                                        value={values.account}

                                                        fullWidth
                                                    />
                                                }
                                            />
                                        </Grid> */}
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
                                                    {/* <Field
                                                    innerRef={fileRef}
                                                    name="files"
                                                    type="file"
                                                    multiple
                                                    class="form-control"
                                                    onchange={(event)=>{setFieldValue('file',event.target.files)}}
                                                /> */}

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
                                        <Grid item xs={6} md={12} >
                                            <Button type='success' variant="contained" color="secondary">Save</Button>
                                            <Button type="reset" variant="contained" >Cancel</Button>
                                        </Grid>
                                    </Grid>
                                </Form>
                            </>
                        )
                    }
                </Formik>
            </div>
        </div>
    )
}
export default ContactForm



// import React ,{useState,useEffect}from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { Grid,Button ,FormControl, Input,Autocomplete, TextField,Select,MenuItem} from "@mui/material";
// import axios from 'axios'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate } from "react-router-dom";
// import { useRef } from "react";
// import Thumb from "./Thumb";
// import SimpleSnackbar from "../toast/test";
// import ComboBox from "./lookup";
// import BasicSelect from "./Select";

// const url ="http://localhost:4000/api/contactInsert";


// const initialValues={
//                         account:{id:'',accountName:''},
//                         salutation:'',
//                         firstName:'',
//                         lastName:'',
//                         dop:'',
//                         phone:'',
//                         department:'',
//                         leadSource:'',
//                         email:'',
//                         mailingAddress:'',
//                         description:'',
//                         file:'',
//                         date:'',
//                         createdbyId: '',
//                         createdDate: '',
// }

// const validationSchema = Yup.object({
//     // lastName:Yup
//     //         .string()
//     //         .max(5,'length should be less 5')
//     //         .required('Required'),
//     email: Yup
//             .string()
//             .email('Invalid email address')
//             .required('Required'),
// })

// const onSubmit= (values,{resetForm}) => {
//     console.log(values);
//     resetForm({values:''})
// }

// const ContactForm = () => {

//      const fetchAccountsUrl ="http://localhost:4000/api/accountsname";

//     const navigate =useNavigate();
//     const fileRef = useRef();
//     const[showAlert,setShowAlert] = useState(false);
//     const[alertMessage,setAlertMessage]=useState();
//     const[alertSeverity,setAlertSeverity]=useState();
//     const[alertNotes,setAlertNotes]=useState({
//                                         isShow:false,
//                                         message:'',
//                                         severity:''
//                                     })

//      const [name,setName]=useState([])
//     //  useEffect(()=>{
//     //     fetchAccountsName();
       
     

//     // // },[])

//     // const fetchAccountsName=()=>{
//     //     axios.post(fetchAccountsUrl)
//     //     .then((res)=>{
//     //         console.log('res fetchAccountsUrl',res.data)
            
//     //         setName(res.data)
            
//     //     })
//     //     .catch((error)=>{
//     //         console.log('error fetchAccountsUrl',error);
//     //     })
//     // }

//     const toastCloseCallback=()=>{
//         setShowAlert(false)
//     }

//     return (
//         <div className="container mb-10">
//             <div className="col-lg-12 text-center mb-3">
//                 <h3>New Contact</h3>
//             </div>
//             <div class="container overflow-hidden ">
//                 <Formik
//                     initialValues={initialValues}
//                     validationSchema={validationSchema}
//                     onSubmit={(values, { resetForm }) => {
//                         console.log(values);
//                         console.log('values',values);
//                         // const formData = new FormData()
//                         // formData.append('file', values)

//                         // axios.post(url,formData,{
//                         //     headers: {
//                         //       'Content-Type': 'multipart/form-data'
//                         //     }})
//                         // // axios.post(url,values)
//                         // .then((res)=>{
//                         //     console.log('post response',res);
//                         //     console.log('post ','data send');
                           
                         
//                         //     setShowAlert(true)
//                         //     setAlertMessage(res.data)
//                         //     setAlertSeverity('success')
//                         //     resetForm({ values: '' })
//                         //     setTimeout(() => {
//                         //         // navigate(-1);
//                         //     }, 2000);

                            
//                         // })
//                         // .catch((error)=> {
//                         //     console.log('error',error);
//                         //     setShowAlert(true)
//                         //     setAlertMessage(error.message)
//                         //     setAlertSeverity('error')

//                         // })
//                       }}
//                      >

// {/* {({ setFieldValue, handleSubmit }) => ( */}
//                 {({ values,
//                                 dirty,
//                                 isSubmitting,
//                                 handleChange,
//                                 handleSubmit,
//                                 handleReset,
//                                 setFieldValue,
//                             })=>( 
//         <form onSubmit={handleSubmit}>
//             <FormControl>
//              <Grid container spacing={2}>
//             <Grid item xs={6} md={2}>
//                 <Field  component={BasicSelect} value={values.salutation} name="salutation" label="salutation" variant="outlined" fullWidth />          
//             </Grid>
//             <Grid item xs={6} md={4}>
//             <Field component={TextField} name="firstName" label="First Name" variant="outlined" fullWidth />
//             </Grid>
//             <Grid item xs={6} md={6}>
//             <Field component={TextField} name="lastName" label="Last Name" variant="outlined" fullWidth />
           
//             <div style={{ color: 'red' }}>
//                 <ErrorMessage name="lastName" />
//             </div>
//             </Grid>
//         <Grid item xs={6} md={6}>
            
//              <Autocomplete
//                 disablePortal
//                 id="account"
//                 name="account"
//                 options={name}
//                 onChange={(e,value)=>{
//                     console.log('value',value);
//                     setFieldValue("account",value)
//                 }
//                 }
//                 // getOptionLabel={(option)=>(option.accountName?option.accountName:'')}
//                 getOptionLabel={(option) => option.accountName || ""}
//                 renderInput={(params) =>
                  
//                     <Field 
//                       component={TextField}
//                     { ...params }
//                     // onChange={ handleChange }
//                     margin="normal"
//                     label="Account"
//                     name="account"
//                     value={values.account}
                   
//                     fullWidth
//                   />
//                 } 
//             /> 

//         </Grid> 
//         <Grid item xs={6} md={6}>            
//             <Field component={TextField} name="phone" label="phone" variant="outlined" fullWidth />
//         </Grid>
//         <Grid item xs={6} md={6}>
//             <Field component={TextField} name="department" label="Department" variant="outlined" fullWidth />
//         </Grid>
//         <Grid item xs={6} md={6}>
//             <Field component={TextField} name="email" label="Email" variant="outlined" type="email" fullWidth />
//             {/* <div style={{ color: 'red' }}>
//                 <ErrorMessage name="email" />
//             </div> */}
//         </Grid>
//         <Grid item xs={6} md={6}>
//             <label htmlFor="leadSource"> lead Source</label>
//             <Field name="leadSource" as="select" class="form-select">
//                 <option value="">--Select--</option>
//                 <option value="web">Web</option>
//                 <option value="phone Inquiry">phone Inquiry</option>
//                 <option value="Partner Referral">Partner Referral</option>
//                 <option value="Purchased List">Purchased List</option>
//                 <option value="other">Other</option>
//             </Field>
//         </Grid>
//         <Grid Grid item xs={6} md={6}>
            
//         <Field component={TextField} name="file" label="File" variant="outlined" fullWidth type="file" multiple onChange={(event) => {
//             setFieldValue("file", event.currentTarget.files);
//             }} />
//         </Grid>
//         <Grid item xs={6} md={6}>
//             <Field component={TextField} name="date" label="Date" type='date' variant="outlined" fullWidth />
//         </Grid>
//         <Grid item xs={6} md={12} >
//             <Button type='Submit' variant="contained" color="secondary">Save</Button>
//             <Button type="reset" variant="contained" >Cancel</Button>
//         </Grid>
//     </Grid>
// </FormControl>
// </form>
    
//     )}
    
//      </Formik>
//   </div>
//         </div>
//     )
//   }
// export default ContactForm
