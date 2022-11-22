import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.css";
import CurrencyInput from 'react-currency-input-field';

const initialValues={
                        accountName:'',
                        accountNumber:'',
                        annualRevenue:'',
                        rating:'',
                        type:'',
                        phone:'',
                        industry:'',
                        noofEmployees:'',
                        fax:'',
                        billingAddress:'',
                        shippingAddress:'',
                        website:'',
                        description:'',
                        accountOwnerId:'',
                        createdbyId:'',
                        createdDate:'',

}

const validationSchema = Yup.object({
    accountName:Yup
            .string()
            .required('Required'),
    rating:Yup
            .string()
            .required('Required'),
})

const onSubmit= (values,{resetForm}) => {
    console.log(values);
    resetForm({values:''})
}

const AccountForm = () => {
    return (
    <div className="container mb-10">
            {/* <div className="row mb-3"> */}
                <div className="col-lg-12 text-center mb-3">
                    <h3>New Account</h3>
                </div>
            {/* </div> */}
            <div class="container overflow-hidden ">
        <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
                onSubmit={onSubmit}
      >
        
        <Form >
        
        <div class="row justify-content-center gy-4">
            <div class="col-md-6 mb-0 ">
                <label htmlFor="accountName">Name  <span className="text-danger">*</span></label>
                <Field name="accountName" type="text" class="form-control"/>
                <div style={{ color: 'red'}}>
                    <ErrorMessage name="accountName" />
                </div>
                
            </div>
            <div class="col-md-6 ">
                <label htmlFor="accountNumber">Account Number </label>
                <Field name="accountNumber" type="text"class="form-control" />
            </div>
            <div class="col-md-6">
                <label htmlFor="annualRevenue">Aannual Revenue</label>
                <CurrencyInput class="form-control" intlConfig={{ locale: 'en-US', currency: 'USD'  }} />
                {/* <Field name="annualRevenue" type="number" class="form-control"/> */}
            </div>
            <div class="col-md-6">
                <label htmlFor="phone">Phone</label>
                <Field name="phone" type="phone" class="form-control"/>
            </div>
            <div class="col-md-6">
                <label htmlFor="rating"> Rating
                    <span className="text-danger">*</span>
                </label>
                <Field name="rating" as="select" class="form-select">
                    <option value="">--Select--</option>
                    <option value="Hot">Hot</option>
                    <option value="Warm">Warm</option>
                    <option value="Cold">Cold</option>
                </Field>
                <div style={{ color: 'red'}} >
                    <ErrorMessage name="rating"/>
                </div>
            </div>
            <div class="col-md-6">
                <label htmlFor="type">Type</label>
                <Field name="type" as="select" class="form-select">
                    <option value="">--Select--</option>
                    <option value="Prospect">Prospect</option>
                    <option value="Customer - Direct">Customer - Direct</option>
                    <option value="Customer - Channel">Customer - Channel</option>
                    <option value="Channel Partner / Reseller">Channel Partner / Reseller</option>
                    <option value="Installation Partner"> Installation Partner</option>
                    <option value="Technology Partner">Technology Partner</option>
                    <option value="Other" >Other</option>
                </Field>
            </div>
            <div class="col-md-6">
                <label htmlFor="industry">Industry</label>
                <Field name="industry" as="select" class="form-select">
                    <option value="">--Select--</option>
                    <option value="Agriculture" >Agriculture</option>
                    <option value="Banking" >Banking</option>
                    <option value="Communications" >Communications</option>
                    <option value="Construction" >Construction</option>
                    <option value="Consulting" >Consulting</option>
                    <option value="Education" >Education</option>
                    <option value="Engineering" >Engineering</option>
                    <option value="Government" >Government</option>
                    <option value="Manufacturing" >Manufacturing</option>
                    <option value="Hospitality" >Hospitality</option>
                    <option value="Insurance" >Insurance</option>
                    <option value="Technology" >Technology</option>
                    <option value="Transportation" >Transportation</option>
                    <option value="Other" >Other</option>
                </Field>
            </div>
            <div class="col-md-6">
                <label htmlFor="noofEmployees">Number of Employees</label>
                <Field name="noofEmployees" type="text" class="form-control"/>
            </div>
            <div class="col-md-6">
                <label htmlFor="billingAddress">Billing Address </label>
                <Field name="shippingAddress" type="text"class="form-control" />
            </div>
            <div class="col-md-6">
                <label htmlFor="shippingAddress">Shipping Address </label>
                <Field name="shippingAddress" type="text"class="form-control" />
            </div>
            <div class="col-md-6">
                <label htmlFor="website">Website</label>
                <Field name="website" type="text" class="form-control"/>
            </div>
            <div class="col-md-6">
                <label htmlFor="fax">Fax</label>
                <Field name="fax" type="text" class="form-control"/>
            </div>
            <div class="col-md-12">
                <label htmlFor="comments">Comments</label>
                <Field  as="textarea"  name="comments"class="form-control" />
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
export default AccountForm




// const LoginForm = () => {
//     return (
//         <Formik
//         initialValues={{ firstName: '', lastName: '', email: '' ,city:'',rating:'',industry:'',annualRevenue:'',}}
//         validationSchema={Yup.object({
//                                         firstName: Yup.string()
//                                             .max(15, 'Must be 15 characters or less')
//                                             .required('Required'),
//                                         lastName: Yup.string()
//                                             .max(20, 'Must be 20 characters or less')
//                                             .required('Required'),
//                                         email: Yup.string().email('Invalid email address').required('Required'),
//                                         annualRevenue:Yup.number()
//                                     })
//                         }
//         onSubmit={(values,{resetForm}) => {
//            console.log(values);
//            resetForm({values:''})
//         }}
//       >
//         <Form>
//         <div class="container overflow-hidden"> 
//         <div class="row gy-5">
//             <div class="col-md-6">
//                 <label htmlFor="firstName">First Name</label>
//                 <Field name="firstName" type="text" class="form-control"/>
//                 <ErrorMessage name="firstName" />
//             </div>
//             <div class="col-md-6">
//                 <label htmlFor="lastName">Last Name</label>
//                 <Field name="lastName" type="text"class="form-control" />
//                 <ErrorMessage name="lastName" />
//             </div>
        
//             <div class="col-md-6">
//                 <label htmlFor="email">Email Address</label>
//                 <Field name="email" type="email" class="form-control"/>
//                 <ErrorMessage name="email" />
//             </div>
//             <div class="col-md-6">
//                 <label htmlFor="annualRevenue">Aannual Revenue</label>
//                 <Field name="annualRevenue" type="number" class="form-control"/>
//                 <ErrorMessage name="annualRevenue" />
//             </div>
//             <div class="col-md-6">
//                 <label htmlFor="rating">Rating</label>
//                 <Field name="rating" as="select" class="form-select">
//                     <option value="" >--Select--</option>
//                     <option value="Prospect" >Prospect</option>
//                     <option value="Customer-Direct" >Customer-Direct</option>
//                     <option value="Customer-Channel" >Customer-Channel</option>
//                 </Field>
//             </div>
//             <div class="col-md-6">
//                 <label htmlFor="city">City</label>
//                 <Field name="city" as="select" class="form-select">
//                     <option value="" >--Select--</option>
//                     <option value="NY" >NY</option>
//                     <option value="LA" >LA</option>
//                     <option value="CA" >CA</option>
//                 </Field>
//             </div>
//             <div class="col-md-6">
//                 <label htmlFor="industry">Industry</label>
//                 <Field name="industry" as="select" class="form-select">
//                     <option value="">--Select--</option>
//                     <option value="Banking" >Banking</option>
//                     <option value="Energy" >Energy</option>
//                     <option value="Medical" >Medical</option>
//                     <option value="Manufacturing" >Manufacturing</option>
//                     <option value="Real Estate" >Real Estate</option>
//                 </Field>
//             </div>
//             <div class="col-md-1">
//                 <button type="submit" class="btn btn-primary">Submit</button>
//             </div>
//             <div class="col">
//                 <button type="reset" class="btn btn-secondary" text='clear all' >Clear</button>
//             </div>
//         </div>
//         </div>
//         </Form>
//       </Formik>
//     );
//   }
// export default LoginForm

