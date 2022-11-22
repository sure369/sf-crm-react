import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.css";
import CurrencyInput from 'react-currency-input-field';
import DatePicker  from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const initialValues={
                        accountName:'',
                        opportunityName:'',
                        type:'',
                        leadSource:'',
                        amount:'',
                        closeDate:'',
                        stage:'',
                        description:'',
}

const validationSchema = Yup.object({
    opportunityName:Yup
            .string()
            .required('Required'),
})

const onSubmit= (values,{resetForm}) => {
    console.log(values);
    resetForm({values:''})
}

const OpportunityForm = () => {

    const[startDate,setStartDate] =useState(new Date());

    return (
    <div className="container mb-10">
            {/* <div className="row mb-3"> */}
                <div className="col-lg-12 text-center mb-3">
                    <h3>New Opportunity</h3>
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
                <label htmlFor="opportunityName" >Opportunity Name<span className="text-danger">*</span> </label>
                <Field name='opportunityName' type="text" class="form-control"/>
                <div style={{ color: 'red'}}>
                    <ErrorMessage name="opportunityName" />
                </div>                
            </div>
            <div class="col-md-6 ">
                <label htmlFor="accountName">Account Name </label>
                <Field name="accountName" type="text"class="form-control" />
            </div>
            <div class="col-md-6">
                <label htmlFor="stage">Opportunity Stage</label>
                <Field name="stage" as="select" class="form-select">
                    <option value="">--Select--</option>
                    <option value="Prospecting">Prospecting</option>
                    <option value="Needs Analysis">Needs Analysis</option>
                    <option value="Value Proposition">Value Proposition</option>
                    <option value="Perception Analysis">Perception Analysis</option>
                    <option value="Proposal Quote">Proposal Quote</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won">Closed Won</option>             
                    <option value="Closed Lost">Closed Lost</option>
                </Field>
            </div>

            <div class="col-md-6">
                <label htmlFor="type">Type</label>
                <Field name="type" as="select" class="form-select">
                    <option value="">--Select--</option>
                    <option value="New Customer">New Customer</option>
                    <option value="Existing Customer - Upgrade">Existing Customer - Upgrade</option>
                    <option value="Existing Customer - Replacement">Existing Customer - Replacement</option>
                    <option value="Existing Customer - Downgrade">Existing Customer - Downgrade</option>
                </Field>
            </div>
            
            <div class="col-md-6">
                <label htmlFor="leadSource"> Lead Source</label>
                <Field name="leadSource" as="select" class="form-select">
                    <option value="">--Select--</option>
                    <option value="web">Web</option>
                    <option value="phone Inquiry">phone Inquiry</option>
                    <option value="Partner Referral">Partner Referral</option>
                    <option value="Purchased List">Purchased List</option>
                    <option value="other">Other</option>
                </Field>
            </div>


            <div class="col-md-6">
                <label htmlFor="amount">Amount</label>
                <CurrencyInput class="form-control" intlConfig={{ locale: 'en-US', currency: 'USD'  }} />
            </div>

            <div class="col-md-6">
                <label htmlFor="closeDate">Close Date <span className="text-danger">*</span></label>
                <DatePicker  selected={startDate} onChange={(date)=>setStartDate(date)} class="form-control"/>
                {/* <div style={{ color: 'red'}}>
                    <ErrorMessage name="email" />
                </div>  */}
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
export default OpportunityForm
