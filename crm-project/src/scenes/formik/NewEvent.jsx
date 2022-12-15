
import React ,{ useEffect, useState ,useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {useLocation ,useNavigate} from 'react-router-dom';
import { Grid,Button ,FormControl,Stack ,Alert,DialogActions} from "@mui/material";
import axios from 'axios'
import SimpleSnackbar from "../toast/test";
import "./FormStyles.css"
import PreviewFile from "./PreviewFile";

const url ="http://localhost:4000/api/accountInsert";







const NewEventForm = ({item}) => {

    const [singleContact,setsingleContact]= useState(); 

    const[showAlert,setShowAlert] = useState(false);
    const[alertMessage,setAlertMessage]=useState();
    const[alertSeverity,setAlertSeverity]=useState();
    const[alertNotes,setAlertNotes]=useState({
                                        isShow:false,
                                        message:'',
                                        severity:''
                                    })
    const navigate =useNavigate();
    const fileRef =useRef();
    const location = useLocation();

    useEffect(()=>{
        console.log('inside useeffect', location.state.record.item);
        setsingleContact(location.state.record.item)
    })

    const initialValues = {
        subject:'',
        nameofContact: '',
        realatedTo:'',
        assignedTo:'',
        startDate:'',
        startTime:'',
        EndDate:'',
        EndTime:'',
        description:'',
        attachments:null,
    }

    const validationSchema = Yup.object({
        subject: Yup
            .string()
            .required('Required'),
        realatedTo: Yup
            .string()
            .required('Required'),
    })
    
    const formSubmission = (values, { resetForm }) => {
        console.log(values);
        resetForm({ values: '' })
    }
    

    const toastCloseCallback=()=>{
        setShowAlert(false)
    }

    return (
        <Grid item xs={12} style={{margin:"20px"}}>  
        <div style={{textAlign:"center" ,marginBottom:"10px"}}>
        <h3> Task </h3>
    </div>        
            
      
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values,{resetForm})=>formSubmission(values,{resetForm})}
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
          <Form>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="subject">Subject  <span className="text-danger">*</span></label>
                                            <Field name="subject" as="select" class="form-input">
                                                <option value =""> </option>
                                                <option value ="call"> Call</option>
                                                <option value ="email"> Email</option>
                                                <option value ="meeting"> Meeting</option>
                                                <option value ="send Quotw"> Send Quote</option>
                                            </Field>
                                               
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="subject" />
                                            </div>
                                        </Grid>
                                        {/* <Grid item xs={6} md={6}>
                                            <label htmlFor="nameofContact">Name of Contact  </label>
                                            <Field name="nameofContact" type="text" 
                                            value={singleContact.firstName}
                                             class="form-input" />
                                        </Grid> */}
                                        {/* <Grid item xs={6} md={6}>
                                            <label htmlFor="realatedTo">Realated To  </label>
                                            <Field name="realatedTo" type="text" class="form-input" />
                                        </Grid> */}
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="assignedTo">assignedTo  </label>
                                            <Field name="assignedTo" type="text" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="startDate">startDate   </label>
                                            <Field name="startDate" type="date" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="startTime">startTime   </label>
                                            <Field name="startTime" type="time" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="EndDate">EndDate   </label>
                                            <Field name="EndDate" type="date" class="form-input" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="EndTime">EndTime   </label>
                                            <Field name="EndTime" type="time" class="form-input" />
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                           
                                            <label htmlFor="attachments">attachments</label>          
                                                <input id="attachments" name="attachments" type="file" 
                                                ref={fileRef} 
                                                onChange={(event) => {
                                                setFieldValue("attachments", event.target.files[0]);
                                                }} className="form-input" />

                                                {values.attachments && <PreviewFile file={values.attachments} />}

                                                {/* <button onclick ={()=>{
                                                    fileRef.current.click();
                                                }}
                                                > preview </button> */}
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <label htmlFor="description">Description</label>
                                            <Field as="textarea" name="description" class="form-input" />
                                        </Grid>
                                        
                                    </Grid>
                                       
                                        <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>

                                                <Button type='success' variant="contained" color="secondary" >Save</Button>
                                                                                
                                     
                                        </DialogActions>     
                                       </div>
                                </Form>
                        </>
            )
             }}
                </Formik>
        
      
                </Grid>
    )

  }
export default NewEventForm

