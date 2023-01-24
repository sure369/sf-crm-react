import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, FormControl, Input, TextField ,Select,MenuItem} from "@mui/material";
import axios from 'axios'
import { Autocomplete } from "@mui/material";
//import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import Thumb from "./Thumb";
import "./FormStyles.css"
import CustomizedSelectForFormik from "./CustomizedSelectForFormik";
import {AccRatingPickList} from '../../data/pickLists'

const initialValues = {
    rating:'',
    age:'',
    list:''
}
// const ratingList =[
//     {label:'Hot',value:'hot'},
//     {label:'Cold',value:'cold'},
//     {label:'Warm',value:'warm'},
// ]

function PicklistField() {
  return (
    <div className="container mb-10">
            <div className="col-lg-12 text-center mb-3">
                <h3>New Contact</h3>
            </div>
            <div class="container overflow-hidden ">
                <Formik
                    initialValues={initialValues}
                  
                    onSubmit={(values, { resetForm }) => {
                        console.log('values',values);
     
                       
                    }}
                >
                 {({ values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,setFieldValue}) => (
                    <>
                               
                                <Form>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="rating">rating  </label>
                                            <Field name="rating" as="select" class="form-input">
                                            <option value=''><em>None</em></option>
                                                {
                                                    AccRatingPickList.map((i)=>{
                                                        
                                                       return <option value={i.value}>{i.label}</option>
                                                        
                                                    })
                                                }

                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                        <label htmlFor="age">age  </label>
                                        <Field name="age"component={CustomizedSelectForFormik} >
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
                                        </Field>

                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                        <label htmlFor="list">list  </label>
                                        <Field name="list"component={CustomizedSelectForFormik} >
                                         
                                            <MenuItem value=''><em>None</em></MenuItem>
                                         {
                                            AccRatingPickList.map((i)=>{
                                              return  <MenuItem value={i.value}>{i.label}</MenuItem>
                                            })
                                         }
                                        </Field>

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

export default PicklistField