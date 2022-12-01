import React ,{useState}from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid,Button ,FormControl, Input} from "@mui/material";
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import Thumb from "./Thumb";
import SimpleSnackbar from "../toast/test";

const initialValues={
    title:'',
    date:'',
    time:'',
    contact:'',
    notes:'',
    number:'',
    assignTo:'',
    senMeetingmainder:'',
    test:'',
    createdbyId: '',
    createdDate: '',
}

const validationSchema = Yup.object({
    title:Yup
            .string()
            .required('Required'),

})



const EventForm =() =>{
 
    return (
    <>

<div className="container mb-10">
            <div className="col-lg-12 text-center mb-3">
                <h3>New Contact</h3>
            </div>
            <div class="container overflow-hidden ">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                       
                        console.log(values);

                      }}
                     >

{/* {({ setFieldValue, handleSubmit }) => ( */}
                {
                (props) => {
                            const {
                                values,
                                dirty,
                                isSubmitting,
                                handleChange,
                                handleSubmit,
                                handleReset,
                                setFieldValue,
                            } = props;
    return(
        <>       
         <form onSubmit={handleSubmit}>

            <FormControl>
             <Grid container spacing={2}>
            <Grid item xs={6} md={2}>
            <label htmlFor="title">Title  </label>
            <Field name="title" as="select" class="form-control">
                <option value="">--Select--</option>
                <option value="Plan a task">Plan a task</option>
                <option value="Send an email">Send an email</option>
                <option value="Call">Call</option>
                <option value="Meeting">Meeting</option>
            </Field>
            </Grid>
            <Grid item xs={6} md={4}>
            <label htmlFor="date" >Type=Date</label>
            <Field name='date' type="date" class="form-control" />
            </Grid>
            
            <Grid item xs={6} md={6}>
                 <label htmlFor="time" >Time<span className="text-danger">*</span> </label>
            <Field name='time' type="time" class="form-control" />
            </Grid>
            <Grid item xs={6} md={6}>
                 <label htmlFor="number" >type:number<span className="text-danger">*</span> </label>
            <Field name='number' type="number" class="form-control" />
            </Grid>
        <Grid item xs={6} md={6}>
            <label htmlFor="contact">Contact</label>
            <Field name="contact" type="text" class="form-control" />
        </Grid>
        <Grid item xs={6} md={6}>
            <label htmlFor="notes">Notes</label>
            <Field name="notes" as="textarea" class="form-control" />
        </Grid>
        <Grid item xs={6} md={6}>
            <label htmlFor="assignTaskTo">Assign Task To</label>
            <Field name="assignTaskTo" type="text" class="form-control" />
        </Grid>
        <Grid item xs={6} md={6}>
            <label htmlFor="email">Email <span className="text-danger">*</span></label>
            <Field name="email" type="text" class="form-control" />
        </Grid>
        
        <Grid item xs={6} md={12} >
            <Button type='success' variant="contained" color="secondary">Save</Button>
            <Button type="reset" variant="contained" >Cancel</Button>
        </Grid>
    </Grid>
</FormControl>
</form>
        </>
    )
                }}
     </Formik>
  </div>
        </div>

    </>
  )
}

export default EventForm