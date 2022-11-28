import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CurrencyInput from 'react-currency-input-field';
import { Grid,Button ,FormControl} from "@mui/material";
import { useParams,useNavigate } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'


const url ="http://localhost:4000/api/editOpportunity";

const OpportunityDetailPage = ({item}) => {

    const [singleOpportunity,setSinglOpportunity]= useState(); 
    const location = useLocation();
    const navigate =useNavigate();

    useEffect(()=>{
        console.log('passed record',location.state.record.item);
        setSinglOpportunity(location.state.record.item);       
    })

    const initialValues = {
        accountName: singleOpportunity?.accountName ?? "",
        opportunityName:  singleOpportunity?.opportunityName ?? "",
        type: singleOpportunity?.type ?? "",
        leadSource:  singleOpportunity?.leadSource ?? "",
        amount:  singleOpportunity?.amount ?? "",
        closeDate:  singleOpportunity?.closeDate ?? "",
        stage:  singleOpportunity?.stage ?? "",
        createdbyId:  singleOpportunity?.createdbyId ?? "",
        createdDate:  singleOpportunity?.createdDate ?? "",
        description:  singleOpportunity?.description ?? "",
        _id:   singleOpportunity?._id ?? "",
    }



    const validationSchema = Yup.object({
        opportunityName: Yup
            .string()
            .required('Required'),
    })
    const[startDate,setStartDate] = useState(new Date())
  return (
      

     <div className="container mb-10">
                 <div className="col-lg-12 text-center mb-3">
                     <h3> Opportunity Detail page</h3>
                 </div>
             <div class="container overflow-hidden ">
         <Formik
          enableReinitialize={true} 
         initialValues={initialValues}
         validationSchema={validationSchema}
         onSubmit={ (values, { resetForm }) => {
            console.log('values',values)

             axios.post(url,values)
             .then((res)=>{
                 console.log('post response',res);
                 console.log('post ','data send');
                //  resetForm({ values: '' })
                 navigate(-1)
             })
             .catch((error)=> {
                 console.log('error',error);
               })
           }}
       >
         
         <Form>
         <FormControl>
         <Grid container spacing={2}>
             <Grid item xs={6} md={6}>
             <label htmlFor="opportunityName" >Opportunity Name<span className="text-danger">*</span> </label>
                 <Field name='opportunityName' type="text" class="form-control"/>
                 <div style={{ color: 'red'}}>
                     <ErrorMessage name="opportunityName" />
                 </div>
             </Grid>
                             
             <Grid item xs={6} md={6}>
             <label htmlFor="accountName">Account Name </label>
                 <Field name="accountName" type="text"class="form-control" />
             </Grid>
                 
             <Grid item xs={6} md={6}>
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
             </Grid>
                
             <Grid item xs={6} md={6}>
             <label htmlFor="type">Type</label>
                 <Field name="type" as="select" class="form-select">
                     <option value="">--Select--</option>
                     <option value="New Customer">New Customer</option>
                     <option value="Existing Customer - Upgrade">Existing Customer - Upgrade</option>
                     <option value="Existing Customer - Replacement">Existing Customer - Replacement</option>
                     <option value="Existing Customer - Downgrade">Existing Customer - Downgrade</option>
                 </Field>
             </Grid>
               
 
             
             <Grid item xs={6} md={6}>
             <label htmlFor="leadSource"> Lead Source</label>
                 <Field name="leadSource" as="select" class="form-select">
                     <option value="">--Select--</option>
                     <option value="web">Web</option>
                     <option value="phone Inquiry">phone Inquiry</option>
                     <option value="Partner Referral">Partner Referral</option>
                     <option value="Purchased List">Purchased List</option>
                     <option value="other">Other</option>
                 </Field>
             </Grid>          
             
            
 
             <Grid item xs={6} md={6}>
             <label htmlFor="amount">Amount</label>
                 <CurrencyInput class="form-control" intlConfig={{ locale: 'en-US', currency: 'USD'  }} />
             </Grid>           
             <Grid item xs={12} md={12}>
                 <label htmlFor="description">Description</label>
                 <Field  as="textarea"  name="description"class="form-control" />
             </Grid>
             <Grid item xs={12} md={12}>
                <Button type='success' variant="contained" color="secondary">Update</Button>
                <Button type="reset" variant="contained" >Cancel</Button>
             </Grid>
         </Grid>
         </FormControl>
         </Form>
       </Formik>
       </div>
     </div>
     )

}
export default OpportunityDetailPage;























// import React, { useEffect, useState } from 'react'
// import {useLocation} from 'react-router-dom';
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import CurrencyInput from 'react-currency-input-field';
// import { Grid,Button ,FormControl} from "@mui/material";
// import { useParams,useNavigate } from "react-router-dom"
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios'
// import DatePickerField from "../formik/datePick";


// const url ="http://localhost:4000/api/editOpportunity";

// const OpportunityDetailPage = ({item}) => {

//     const [singleOpportunity,setsingleOpportunity]= useState(); 
//     const location = useLocation();
//     const navigate =useNavigate();

//     useEffect(()=>{
//         console.log('passed record',location.state.record.item);
//         setsingleOpportunity(location.state.record.item);       
//     })

//     const initialValues = {
//         accountName: singleOpportunity?.accountName ?? "",
//         opportunityName:  singleOpportunity?.opportunityName ?? "",
//         type: singleOpportunity?.type ?? "",
//         leadSource:  singleOpportunity?.leadSource ?? "",
//         amount:  singleOpportunity?.amount ?? "",
//         closeDate:  singleOpportunity?.closeDate ?? "",
//         stage:  singleOpportunity?.stage ?? "",       
//         description:  singleOpportunity?.description ?? "",
//         _id:   singleOpportunity?._id ?? "",
//     }



//     const validationSchema = Yup.object({
//         opportunityName: Yup
//             .string()
//             .required('Required'),
//         stage: Yup
//             .string()
//             .stage('Invalid stage address')
//             .required('Required'),
//     })
    
//   return (
//         <div className="container mb-10">
//             <div className="col-lg-12 text-center mb-3">
//                 <h3>Opportunity Detail page</h3>
//             </div>

//             <div class="container overflow-hidden ">

//                 <Formik
//                     enableReinitialize={true} 
//                     initialValues={initialValues}
//                     validationSchema={validationSchema}
//                     onSubmit={async (values) => {
//                         await new Promise((resolve) => setTimeout(resolve, 500));
//                         console.log("updated record values", values);  
                        
//                         axios.post(url,values)
//                         .then((res)=>{
//                             console.log('updated record  response',res);
//                         })
//                         .catch((error)=> {
//                             console.log('updated record error',error);
//                           })
                        
//                       }}
//                 >
//                    {(props) => {
//                             const {
//                                 values,
//                                 dirty,
//                                 isSubmitting,
//                                 handleChange,
//                                 handleSubmit,
//                                 handleReset,
//                                 setFieldValue,
//                             } = props;

//             return (
//                 <form onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//             <Grid item xs={6} md={6}>
//             <label htmlFor="opportunityName" >Opportunity Name<span className="text-danger">*</span> </label>
//                 <Field name='opportunityName' type="text" class="form-control"/>
//                 <div style={{ color: 'red'}}>
//                     <ErrorMessage name="opportunityName" />
//                 </div>
//             </Grid>
                            
//             <Grid item xs={6} md={6}>
//             <label htmlFor="accountName">Account Name </label>
//                 <Field name="accountName" type="text"class="form-control" />
//             </Grid>
                
//             <Grid item xs={6} md={6}>
//             <label htmlFor="stage">Opportunity Stage</label>
//                 <Field name="stage" as="select" class="form-select">
//                     <option value="">--Select--</option>
//                     <option value="Prospecting">Prospecting</option>
//                     <option value="Needs Analysis">Needs Analysis</option>
//                     <option value="Value Proposition">Value Proposition</option>
//                     <option value="Perception Analysis">Perception Analysis</option>
//                     <option value="Proposal Quote">Proposal Quote</option>
//                     <option value="Negotiation">Negotiation</option>
//                     <option value="Closed Won">Closed Won</option>             
//                     <option value="Closed Lost">Closed Lost</option>
//                 </Field>
//             </Grid>
               
//             <Grid item xs={6} md={6}>
//             <label htmlFor="type">Type</label>
//                 <Field name="type" as="select" class="form-select">
//                     <option value="">--Select--</option>
//                     <option value="New Customer">New Customer</option>
//                     <option value="Existing Customer - Upgrade">Existing Customer - Upgrade</option>
//                     <option value="Existing Customer - Replacement">Existing Customer - Replacement</option>
//                     <option value="Existing Customer - Downgrade">Existing Customer - Downgrade</option>
//                 </Field>
//             </Grid>
              

            
//             <Grid item xs={6} md={6}>
//             <label htmlFor="leadSource"> Lead Source</label>
//                 <Field name="leadSource" as="select" class="form-select">
//                     <option value="">--Select--</option>
//                     <option value="web">Web</option>
//                     <option value="leadSource Inquiry">leadSource Inquiry</option>
//                     <option value="Partner Referral">Partner Referral</option>
//                     <option value="Purchased List">Purchased List</option>
//                     <option value="other">Other</option>
//                 </Field>
//             </Grid>
               
//             {/* <Grid item xs={6} md={6}>
//                 <label htmlFor="closeDate" >Close Date</label>
//                 <DatePickerField  name="date" className="form-control"/>
                
            
//             </Grid> */}
        

//             <Grid item xs={6} md={6}>
//             <label htmlFor="amount">Amount</label>
//                 <CurrencyInput class="form-control" intlConfig={{ locale: 'en-US', currency: 'USD'  }} />
//             </Grid>           
//             <Grid item xs={12} md={12}>
//                 <label htmlFor="description">Description</label>
//                 <Field  as="textarea"  name="description"class="form-control" />
//             </Grid>
//             <Grid item xs={6} md={12} >
//                 <Button type='success' variant="contained" color="secondary" onClick={handleSubmit} disabled={isSubmitting}>Submit</Button>
//                 <Button type="reset" variant="contained" onClick={handleReset}  disabled={!dirty || isSubmitting} >Clear</Button>
//             </Grid>
//             </Grid>

//                 </form>
//             )
//              }}
//                 </Formik>
//             </div>
//         </div>   
//   )

// }
// export default OpportunityDetailPage;