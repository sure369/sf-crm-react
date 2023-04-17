import React, { useEffect, useState, useRef ,useCallback } from "react";
import { Formik, Form, Field, ErrorMessage,useField } from "formik";
import * as Yup from "yup";
import {
    Grid, Button, FormControl, Stack, Alert, DialogActions,
    Autocomplete, TextField,MenuItem
} from "@mui/material";
import axios from 'axios'
// import "../formik/FormStyles.css"
import '../recordDetailPage/Form.css'
import CustomizedSelectForFormik from "../formik/CustomizedSelectForFormik";
import { DataLoaderObjectPicklist } from "../../data/pickLists";
import PreviewDataload from "./PreviewUpsert";

const UpsertLeadUrl = `${process.env.REACT_APP_SERVER_URL}/dataloaderlead`;
const UpsertAccountUrl=`${process.env.REACT_APP_SERVER_URL}/dataloaderAccount`;
const UpsertOppUrl=`${process.env.REACT_APP_SERVER_URL}/dataloaderOpportunity`;
const generatePreview =`${process.env.REACT_APP_SERVER_URL}/generatePreview`;

const DataLoadPage = () => {

    const[uplodedData,setUplodedData]=useState([])
    const[uplodedFile,setUploadedFile]=useState()

    useEffect(() => {
       
    }, [])

    const initialValues = {
        file:null,
        attachments:null,
        object:''
    }   
    const SUPPORTED_FORMATS=['text/csv'];
    const FILE_SIZE =1024 * 1024

    const validationSchema = Yup.object({
        object: Yup
            .string()
            .required('Required'),                      
    })
    
    const fileSendValue =(obj,files)=>{

        let formData = new FormData();
        formData.append('file',files)
        formData.append('object',obj);
        console.log('modified formData',formData);
         axios.post(generatePreview, formData)
    
            .then((res) => {
                console.log('form  response', res.data); 
                setUplodedData(res.data)            
            })
            .catch((error) => {
                console.log('form  error', error);
            })
    }

     const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
      
        let formData = new FormData();
        formData.append('file',values.attachments);
        formData.append('object',values.object);
        
        let url = (values.object==='Account')? UpsertAccountUrl : (values.object==='Lead')?UpsertLeadUrl : (values.object==='Opportunity')?UpsertOppUrl:''; 

        console.log('url',url);
        console.log('modified formData',formData);
        await axios.post(url, formData)
    
            .then((res) => {
                console.log('task form Submission  response', res);             
            })
            .catch((error) => {
                console.log('task form Submission  error', error);
            })
      }
      

      const handleModal=()=>{
        setUplodedData([])
      }
    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>Data Loader</h3>                 
            </div>


            <Formik
                initialValues={initialValues}
               validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
            >
                {(props) => {
                    const {
                        values,isValid,
                        dirty,
                        isSubmitting,
                        handleChange,
                        handleSubmit,
                        handleReset,
                        setFieldValue,
                    } = props;

                    return (
                        <>
                           

                            <Form className="my-form">
                                <Grid container spacing={2}>
                                    
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="object">Select Object <span className="text-danger">*</span></label>
                                        
                                        <Field name="object" component={CustomizedSelectForFormik}  className="form-customSelect">	
                                            <MenuItem value=""><em>None</em></MenuItem>
                                               {	
                                                DataLoaderObjectPicklist.map((i)=>{	
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>	
                                                })	
                                               }	
                                            </Field>
                                        <div style={{ color: 'red' }}>
                                                <ErrorMessage name="object" />
                                            </div>
                                    </Grid>
                                       
                                    <Grid item xs={6} md={6}>

                                        <label htmlFor="file">File</label>
                                        
                                        <Field name="file" type="file"
                                        className="form-input"
                                        accept=".csv"
                                        onChange={(event)=>{
                                            setFieldValue("attachments", (event.target.files[0]));
                                            fileSendValue(values.object,(event.target.files[0]))
                                        }} 
                                        />
                                         <div style={{ color: 'red' }}>
                                                <ErrorMessage name="file" />
                                            </div>
                                     
                                    </Grid>
                                    
                                 
                                </Grid>

                                {
    uplodedData.length>0 &&  <PreviewDataload  data={uplodedData} file={uplodedFile} ModalClose={handleModal} obj={values.object}/>
}

                                {/* <div className='action-buttons'>
                                    <DialogActions sx={{ justifyContent: "space-between" }}>

                                   
                                   {
                                    uplodedData.length>0 &&
                                  
                                                <Button type='success' variant="contained" color="secondary" disabled={isValid}>Save</Button>
                                                 
                                            }                                      
                                        

                                    </DialogActions>
                                </div> */}
                            </Form>
                        </>
                    )
                }}
            </Formik>


        </Grid>
    )

     
    
}
export default DataLoadPage


// import React, { useEffect, useState, useRef } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//     Grid, Button, FormControl, Stack, Alert, DialogActions,
//     Autocomplete, TextField
// } from "@mui/material";
// import axios from 'axios'
// import "../formik/FormStyles.css"
// import Papa from 'papaparse';



// const UpsertUrl = "`${process.env.REACT_APP_SERVER_URL}/dataloaderlead`;

// const allowedExtensions =['csv'];

// const DataLoadPage = () => {

//     const [data,setData] = useState([]);
//     const [error,setError] = useState('');
//     const [file,setFile] =useState();

//     const fileReader = new FileReader();




//     useEffect(() => {
     
       
//     }, [])

    
//     const initialValues = {
//         csvFile:null,
//         attachement:'',
//     }


   
//     const validationSchema = Yup.object({
       

//     })

//      const formSubmission = async (values, { resetForm }) => {
//         console.log('inside form Submission', values);
       

//         // await axios.post(UpsertUrl, values)
    
//         //     .then((res) => {
//         //         console.log('task form Submission  response', res);
              
              
//         //     })
//         //     .catch((error) => {
//         //         console.log('task form Submission  error', error);
               
//         //     })
//     }


//     return (
//         <Grid item xs={12} style={{ margin: "20px" }}>
//             <div style={{ textAlign: "center", marginBottom: "10px" }}>
//                 <h3>Upload Files</h3>                 
//             </div>

//             <Formik
//                 enableReinitialize={true}
//                 initialValues={initialValues}
//                 validationSchema={validationSchema}
//                 onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
//             >
//                 {(props) => {
//                     const {
//                         values,
//                         dirty,
//                         isSubmitting,
//                         handleChange,
//                         handleSubmit,
//                         handleReset,
//                         setFieldValue,
//                     } = props;

//                     return (
//                         <>
                            

//                             <Form>
//                                 <Grid container spacing={2}>
                                    
//                                     <Grid item xs={12} md={12}>

//                                         <label htmlFor="csvFile">File </label>
                                        
//                                         <Field name="csvFile" type="file"
//                                         className="form-input"
//                                         onChange={(event)=>{
//                                             setFieldValue("attachement", (event.currentTarget.files[0]));
//                                         }} 
//                                         />
//                                         <div style={{ color: 'red' }}>
//                                             <ErrorMessage name="csvFile" />
//                                         </div>
//                                     </Grid>
                                   
//                                 </Grid>

//                                 <div className='action-buttons'>
//                                     <DialogActions sx={{ justifyContent: "space-between" }}>
                                 
//                                         <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>
                                                                                      
//                                         <Button type="reset" variant="contained" onClick={handleReset} disabled={!dirty || isSubmitting}  >Cancel</Button>

//                                     </DialogActions>
//                                 </div>
//                             </Form>
//                         </>
//                     )
//                 }}
//             </Formik>


//         </Grid>
//     )

// }
// export default DataLoadPage


// const [file, setFile] = useState();
//     const [array, setArray] = useState([]);
  
//     const fileReader = new FileReader();
  
//     const handleOnChange = (e) => {
//       setFile(e.target.files[0]);
//     };
  
//     const csvFileToArray = string => {
//       const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
//       const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
  
//       const array = csvRows.map(i => {
//         const values = i.split(",");
//         const obj = csvHeader.reduce((object, header, index) => {
//           object[header] = values[index];
//           return object;
//         }, {});
//         return obj;
//       });
  
//       setArray(array);
//     };
  
//     const handleOnSubmit = (e) => {
//       e.preventDefault();
  
//       if (file) {
//         fileReader.onload = function (event) {
//           const text = event.target.result;
//           csvFileToArray(text);
//         };
  
//         fileReader.readAsText(file);
//       }
//     };
  
//     const headerKeys = Object.keys(Object.assign({}, ...array));
  
//     return (
//       <div style={{ textAlign: "center" }}>
//         <h1>REACTJS CSV IMPORT EXAMPLE </h1>
//         <form>
//           <input
//             type={"file"}
//             id={"csvFileInput"}
//             accept={".csv"}
//             onChange={handleOnChange}
//           />
  
//           <button
//             onClick={(e) => {
//               handleOnSubmit(e);
//             }}
//           >
//             IMPORT CSV
//           </button>
//         </form>
  
//         <br />
  
//         <table>
//           <thead>
//             <tr key={"header"}>
//               {headerKeys.map((key) => (
//                 <th>{key}</th>
//               ))}
//             </tr>
//           </thead>
  
//           <tbody>
//             {array.map((item) => (
//               <tr key={item.id}>
//                 {Object.values(item).map((val) => (
//                   <td>{val}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     )
