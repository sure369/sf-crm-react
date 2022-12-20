import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid,Button ,Forminput,DialogActions,TextField,Autocomplete} from "@mui/material";
import { useParams,useNavigate } from "react-router-dom"
import axios from 'axios'
import SimpleSnackbar from "../toast/test";
import "../formik/FormStyles.css"


const url ="http://localhost:4000/api/UpsertOpportunity";
// const fetchRecentLeads= "http://localhost:4000/api/recentLeads";

// const fetchRecentInventories= "http://localhost:4000/api/propertyRecentName";
const fetchLeadsbyName ="http://localhost:4000/api/LeadsbyName";
const fetchInventoriesbyName ="http://localhost:4000/api/InventoryName";


const OpportunityDetailPage = ({item}) => {

    const [singleOpportunity,setSinglOpportunity]= useState(); 
    const location = useLocation();
    const navigate =useNavigate();
    const [showNew, setshowNew] = useState()
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();
    const [leadsRecords,setLeadsRecords]= useState([]);
    const [inventoriesRecord,setInventoriesRecord]= useState([]);

    useEffect(()=>{
        console.log('passed record',location.state.record.item);
        console.log('inside opportunity');
        setSinglOpportunity(location.state.record.item); 
        setshowNew(!location.state.record.item)  
        FetchInventoriesbyName('');
        FetchLeadsbyName('');
    },[])

    const initialValues = {
        Lead: '',
        Inventory:'',
        opportunityName: '',
        type: '',
        leadSource: '',
        amount: '',
        closeDate: '',
        stage: '',
        description: '',
        createdbyId: '',
        createdDate:'',
        modifiedDate:'',
    }

    const savedValues = {
         Lead: singleOpportunity?.Lead ?? "",
       
         Inventory: singleOpportunity?.Inventory ?? "",
        
        //  Propertydetails:singleOpportunity?.Inventorydetails[0].propertyName ??"",
        //  Leaddetails:singleOpportunity?.Leaddetails[0].firstName ??"",
        opportunityName:  singleOpportunity?.opportunityName ?? "",
        type: singleOpportunity?.type ?? "",
        leadSource:  singleOpportunity?.leadSource ?? "",
        amount:  singleOpportunity?.amount ?? "",
        closeDate:  singleOpportunity?.closeDate ?? "",
        stage:  singleOpportunity?.stage ?? "",
        description:  singleOpportunity?.description ?? "",
        createdbyId:  singleOpportunity?.createdbyId ?? "",
        createdDate:  singleOpportunity?.createdDate ?? "",
        modifiedDate: singleOpportunity?.modifiedDate ?? "", 
        _id:   singleOpportunity?._id ?? "",
    }
    const validationSchema = Yup.object({
        opportunityName: Yup
            .string()
            .required('Required'),
    })

    const formSubmission =(values)=>{
        console.log('form submission value',values);

        if (showNew) {

            let d = new Date();
            const formatDate =  [d.getDate(), d.getMonth()+1,d.getFullYear()].join('/')+' '+
                                [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
            const formData = new FormData();
            formData.append('Lead', values.Lead);
            formData.append('Inventory', values.Inventory);
            formData.append('opportunityName', values.opportunityName);
            formData.append('type', values.type);
            formData.append('leadSource', values.leadSource);
            formData.append('amount', values.amount);
            formData.append('closeDate', values.closeDate);
            formData.append('stage', values.stage);
            formData.append('description', values.description);
            formData.append('createdbyId', values.createdbyId);
            formData.append('createdDate', formatDate);//new Date()
            formData.append('modifiedDate', formatDate); //new Date()
            // formData.append('_id',values._id)
            console.log('form convert formData ', formData)

        axios.post(url,formData)
             .then((res)=>{
                 console.log('post response',res);
                 setShowAlert(true)
                 setAlertMessage(res.data)
                 setAlertSeverity('success')
                
                 setTimeout(() => {
                    navigate(-1)
                 }, 2000);
             })
             .catch((error)=> {
                 console.log('error',error);
                 setShowAlert(true)
                setAlertMessage(error.message)
                setAlertSeverity('error')
               })
        }
        else if (!showNew) {
            let d = new Date();
                const formatDate =  [d.getDate(), d.getMonth()+1,d.getFullYear()].join('/')+' '+
                                    [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
            const formData = new FormData();
            formData.append('Lead', values.Lead);
            formData.append('Inventory', values.Inventory);
            formData.append('opportunityName', values.opportunityName);
            formData.append('type', values.type);
            formData.append('leadSource', values.leadSource);
            formData.append('amount', values.amount);
            formData.append('closeDate', values.closeDate);
            formData.append('stage', values.stage);
            formData.append('description', values.description);
            formData.append('createdbyId', values.createdbyId);
            formData.append('createdDate', values.createdDate);
            formData.append('modifiedDate', formatDate);//new Date()  //.toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}())
            formData.append('_id', values._id)

            axios.post(url,formData)
             .then((res)=>{
                 console.log('post response',res);
                 setShowAlert(true)
                 setAlertMessage(res.data)
                 setAlertSeverity('success')
                
                 setTimeout(() => {
                    navigate(-1)
                 }, 2000);
             })
             .catch((error)=> {
                 console.log('error',error);
                 setShowAlert(true)
                setAlertMessage(error.message)
                setAlertSeverity('error')
               })

        }
    }

    const toastCloseCallback = () => {
        setShowAlert(false)
    }


    const FetchLeadsbyName =(newInputValue) =>{
        console.log('inside FetchLeadsbyName fn');
        console.log('newInputValue',newInputValue)
        axios.post(`${fetchLeadsbyName}?searchKey=${newInputValue}`)
        .then((res) => {
            console.log('res fetchLeadsbyName', res.data)
            if(typeof(res.data)=== "object"){
                setLeadsRecords(res.data)
            }
        })
        .catch((error) => {
            console.log('error fetchLeadsbyName', error);
        })
    }
   
    const FetchInventoriesbyName =(newInputValue) =>{
        axios.post(`${fetchInventoriesbyName}?searchKey=${newInputValue}`)
        .then((res) => {
            console.log('res fetch Inventoriesby Name', res.data)
            if(typeof(res.data)=== "object"){
                setInventoriesRecord(res.data)
            }
        })
        .catch((error) => {
            console.log('error fetchInventoriesbyName', error);
        })
    }

  return (
      
    <Grid item xs={12} style={{margin:"20px"}}>          
    <div style={{textAlign:"center" ,marginBottom:"10px"}}>
        {
            showNew ? <h3>New Opportunity</h3> : <h3>Opportunity Detail Page </h3>
        }
    </div>
    <div>
        <Formik
            enableReinitialize={true} 
            initialValues={showNew ? initialValues : savedValues}
            validationSchema={validationSchema}
            onSubmit={ (values, { resetForm }) => {formSubmission(values)}}
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
                showAlert ? <SimpleSnackbar severity={alertSeverity} message={alertMessage} showAlert={showAlert} onClose={toastCloseCallback} /> : <SimpleSnackbar message={showAlert} />
            }  
         <Form>
         <Grid container spacing={2}>
             <Grid item xs={6} md={6}>
             <label htmlFor="opportunityName" >Opportunity Name<span className="text-danger">*</span> </label>
                 <Field name='opportunityName' type="text" class="form-input"/>
                 <div style={{ color: 'red'}}>
                     <ErrorMessage name="opportunityName" />
                 </div>
             </Grid>
            
             <Grid item xs={6} md={6}>
             <label htmlFor="Inventory">Inventory Name </label>
                <Autocomplete
                            name="Inventory"
                            options={inventoriesRecord}
                            value={values.Propertydetails}
                          
                             getOptionLabel={option =>  option.propertyName ||''}
                            //  isOptionEqualToValue = {(option,value)=>
                            //           option.propertyName === value
                            //   }

                         
                            onChange={(e, value) => {
                                setFieldValue("Inventory",value.id ||'')
                                // setFieldValue("propertyName", value||'')
                            }}
                            onInputChange={(event, newInputValue) => {
                                console.log('newInputValue',newInputValue);
                                if(newInputValue.length>=3){
                                    FetchInventoriesbyName(newInputValue);
                                }
                            }}
                            renderInput={params => (
                            <Field component={TextField} {...params} name="Inventory" />
                            )}
                />  

             </Grid>

             <Grid item xs={6} md={6}>
             <label htmlFor="Lead">Lead Name </label>
                <Autocomplete
                            name="Lead"
                            options={leadsRecords}
                            value={values.Leaddetails}
                            getOptionLabel={option => option.leadName ||''}
                           
                            onChange={(e, value) => {
                                setFieldValue("Lead",value.id)
                                setFieldValue("leadName",value)
                            }}
                            
                            onInputChange={(event, newInputValue) => {
                                console.log('newInputValue',newInputValue);
                                if(newInputValue.length>=3){
                                    FetchLeadsbyName(newInputValue);
                                }
                            }}
                            renderInput={params => (
                            <Field component={TextField} {...params} name="Lead" />
                            )}
                />  

             </Grid>
            
         

             <Grid item xs={6} md={6}>
             <label htmlFor="stage">Opportunity Stage</label>
                 <Field name="stage" as="select" class="form-input">
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
                 <Field name="type" as="select" class="form-input">
                     <option value="">--Select--</option>
                     <option value="New Customer">New Customer</option>
                     <option value="Existing Customer - Upgrade">Existing Customer - Upgrade</option>
                     <option value="Existing Customer - Replacement">Existing Customer - Replacement</option>
                     <option value="Existing Customer - Downgrade">Existing Customer - Downgrade</option>
                 </Field>
             </Grid>
               
 
             
             <Grid item xs={6} md={6}>
             <label htmlFor="leadSource"> Lead Source</label>
                 <Field name="leadSource" as="select" class="form-input">
                     <option value="">--Select--</option>
                     <option value="web">Web</option>
                     <option value="phone Inquiry">phone Inquiry</option>
                     <option value="Partner Referral">Partner Referral</option>
                     <option value="Purchased List">Purchased List</option>
                     <option value="other">Other</option>
                 </Field>
             </Grid>          
             
            
             <Grid item xs={6} md={6}>
                <label htmlFor="closeDate">Close Date</label>
                <Field name="closeDate" type="date" class="form-input" />
            </Grid>
             <Grid item xs={6} md={6}>
             <label htmlFor="amount">Amount</label>
                 <Field class="form-input" type='number' name="amount" />
             </Grid>           
             <Grid item xs={12} md={12}>
                 <label htmlFor="description">Description</label>
                 <Field  as="textarea"  name="description"class="form-input" />
             </Grid>
             {!showNew && (
                 <>

                <Grid item xs={6} md={6}>
                    {/* value is aagined to  the fields */}
                    <label htmlFor="createdDate" >created Date</label>
                    <Field name='createdDate' type="text" class="form-input" disabled />
                </Grid>

                <Grid item xs={6} md={6}>
                    {/* value is aagined to  the fields */}
                    <label htmlFor="modifiedDate" >Modified Date</label>
                    <Field name='modifiedDate' type="text" class="form-input" disabled/>
                </Grid>
                </>
            )}
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
export default OpportunityDetailPage;























// import React, { useEffect, useState } from 'react'
// import {useLocation} from 'react-router-dom';
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import CurrencyInput from 'react-currency-input-field';
// import { Grid,Button ,Forminput} from "@mui/material";
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
//                 <Field name='opportunityName' type="text" class="form-input"/>
//                 <div style={{ color: 'red'}}>
//                     <ErrorMessage name="opportunityName" />
//                 </div>
//             </Grid>
                            
//             <Grid item xs={6} md={6}>
//             <label htmlFor="accountName">Account Name </label>
//                 <Field name="accountName" type="text"class="form-input" />
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
//                 <DatePickerField  name="date" className="form-input"/>
                
            
//             </Grid> */}
        

//             <Grid item xs={6} md={6}>
//             <label htmlFor="amount">Amount</label>
//                 <CurrencyInput class="form-input" intlConfig={{ locale: 'en-US', currency: 'USD'  }} />
//             </Grid>           
//             <Grid item xs={12} md={12}>
//                 <label htmlFor="description">Description</label>
//                 <Field  as="textarea"  name="description"class="form-input" />
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