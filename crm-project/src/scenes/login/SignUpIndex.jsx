import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate,Link, Navigate } from 'react-router-dom';
import { Grid, Button, DialogActions, InputAdornment, IconButton, Paper,Avatar,Typography,TextField} from "@mui/material";
import axios from 'axios'
import '../recordDetailPage/Form.css'
import Cdlogo from '../assets/cdlogo.jpg';

const singupUrl = `${process.env.REACT_APP_SERVER_URL}/signup`

export default function SignUpIndex() {


    const paperStyle={padding :20,height:'100%',width:280, margin:"20px auto"}
    const avatarStyle={   width: 100,height: 100}
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [showPassword, setShowPassword] = useState(false);

    const users ={userName:'suresh@gmail.com',password:'123456'}

    const navigate=useNavigate()

    const initialValues = {
        userName: '',
        email:'',
        password: '',
        confirmPassword:''
    }

    const validationSchema = Yup.object({
        email:Yup
            .string()
            .email()
            .required('Required'),
        password: Yup
            .string()
            .min(6,"Minimum 6 characters exist")
            .max(15,"Maximum 15 characters exist")
            .required('Please enter your password.')
        ,
        confirmPassword:  Yup.string()
        .required('Please re-enter your password.')
        .oneOf([Yup.ref('password')], 'Your passwords do not match.')
    })
    const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
        values.userName=values.email;
        delete values.confirmPassword;

        console.log('after ', values);

        axios.post(singupUrl,values)
        .then((res)=>{
            console.log(res.data,"sign up response")
        })
        // if(values.userName ===users.userName && values.password === users.password)
        // {
        //      console.log('if')
        //      // localStorage.setItem("authenticated", true);
        //     // navigate("/accounts");
        // }
        // else{
        //     console.log('else')
        // }
       
    }
    return(
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                     <Avatar style={avatarStyle}>
                     <img src={Cdlogo} alt="cdlogo"  style={avatarStyle}/>
                     </Avatar>
                    <h2>Sign Up</h2>
                </Grid>
                {/* <FormikLogin/>              */}
                <Grid item xs={12} style={{ margin: "20px" }}>
               
               <Formik
                   initialValues={initialValues}
                   validationSchema={validationSchema}
                   onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
               >
                   {(props) => {
                       const{isValid,values}=props;
                       return (
                           <>
                               <Form >
                                   <Grid container spacing={2}>

                                   <Grid item xs={12} md={12}>
                                           <label htmlFor="email">Email/User Name  <span className="text-danger">*</span></label>
                                           <Field name="email" type="email" class="login-form-input" />
                                           <div style={{ color: 'red' }}>
                                               <ErrorMessage name="email" />
                                           </div>
                                       </Grid>                                       
                                       <Grid item xs={12} md={12}>
                                            <label htmlFor="password">Password <span className="text-danger">*</span> </label>
                                            <Field name="password"  type='password' class="login-form-input"/>
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="password" />
                                            </div>
                                      </Grid>
                                      <Grid item xs={12} md={12}>
                                            <label htmlFor="confirmPassword">Confirm Password <span className="text-danger">*</span> </label>
                                            <Field name="confirmPassword"  type='password' class="login-form-input"/>
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="confirmPassword" />
                                            </div>
                                      </Grid>
                                      </Grid>
                                      <div className='action-buttons'>
                                       <DialogActions sx={{ justifyContent: "space-between",marginTop:'10px' }}>
                                           <Button   type='success' color="secondary" variant="contained"  disabled={!isValid} >Sign Up</Button>
                                       </DialogActions>
                                   </div>
                               </Form>
                           </>
                       )
                   }}
               </Formik>
           </Grid>

            </Paper>
        </Grid>
    )
}
