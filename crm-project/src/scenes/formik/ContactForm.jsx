import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.css";
import CurrencyInput from 'react-currency-input-field';

const initialValues={
                        accountName:'',
                        salutation:'',
                        firstName:'',
                        lastName:'',
                        dop:'',
                        phone:'',
                        department:'',
                        leadSource:'',
                        email:'',
                        mailingAddress:'',
                        description:'',
}

const validationSchema = Yup.object({
    lastName:Yup
            .string()
            .required('Required'),
    email: Yup
            .string()
            .email('Invalid email address')
            .required('Required'),
})

const onSubmit= (values,{resetForm}) => {
    console.log(values);
    resetForm({values:''})
}

const ContactForm = () => {
    return (
    <div className="container mb-10">
            {/* <div className="row mb-3"> */}
                <div className="col-lg-12 text-center mb-3">
                    <h3>New Contact</h3>
                </div>
            {/* </div> */}
            <div class="container overflow-hidden ">
        <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
                onSubmit={onSubmit}
      >
        
        <Form >
        {/* <span className="text-danger">*</span> */}
        <div class="row justify-content-center gy-4">
            <div class="col-md-6 mb-0 ">
                <h6><label htmlFor="name">Name <span className="text-danger">*</span></label></h6>
                <label htmlFor="salutation">Salutation  </label>
                <Field name="salutation" as="select" class="form-control">
                    <option value="">--Select--</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                 </Field>   
                <label htmlFor="firstName" >First Name</label>
                <Field name='firstName' type="text" class="form-control"/>
                <label htmlFor="lastName" >Last Name<span className="text-danger">*</span> </label>
                <Field name='lastName' type="text" class="form-control"/>
                <div style={{ color: 'red'}}>
                    <ErrorMessage name="lastName" />
                </div>                
            </div>
            <div class="col-md-6 ">
                <label htmlFor="accountName">Account Name </label>
                <Field name="accountName" type="text"class="form-control" />
            </div>
            <div class="col-md-6">
                <label htmlFor="phone">Phone</label>
                <Field name="phone" type="phone" class="form-control"/>
            </div>
            
            <div class="col-md-6 ">
                <label htmlFor="department">Department</label>
                <Field name="department" type="text"class="form-control" />
            </div>
            <div class="col-md-6">
                <label htmlFor="email">Email <span className="text-danger">*</span></label>
                <Field name="email" type="text" class="form-control"/>
                <div style={{ color: 'red'}}>
                    <ErrorMessage name="email" />
                </div> 
            </div>
            <div class="col-md-6">
                <label htmlFor="leadSource"> lead Source</label>
                <Field name="leadSource" as="select" class="form-select">
                    <option value="">--Select--</option>
                    <option value="web">Web</option>
                    <option value="phone Inquiry">phone Inquiry</option>
                    <option value="Partner Referral">Partner Referral</option>
                    <option value="Purchased List">Purchased List</option>
                    <option value="other">Other</option>
                </Field>
            </div>
            <div class="col-md-12">
                <label htmlFor="description">Description</label>
                <Field  as="textarea"  name="description"class="form-control" />
            </div>
            <div class="text-center " >
                <button type="submit" class="btn btn-primary mr-1"  >Submit</button>
                <button type="reset" class="btn btn-secondary "  text='clear all' >Clear</button>
            </div>
        </div>
        </Form>
      </Formik>
      </div>
    </div>
    );
  }
export default ContactForm
